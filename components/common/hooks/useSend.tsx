import {useCallback} from 'react';
import {isAddressEqual} from 'viem';
import useWallet from '@builtbymom/web3/contexts/useWallet';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {ETH_TOKEN_ADDRESS, isZeroAddress, toAddress, toBigInt, ZERO_ADDRESS} from '@builtbymom/web3/utils';
import {defaultTxStatus, getNetwork, transferERC20, transferEther} from '@builtbymom/web3/utils/wagmi';
import {useDeepCompareMemo} from '@react-hookz/web';

import {useSendContext} from '../contexts/useSendContext';
import {getTransferTransaction} from '../utils/tools.gnosis';

import type {TUseBalancesTokens} from '@builtbymom/web3/hooks/useBalances.multichains';
import type {TAddress, TChainTokens} from '@builtbymom/web3/types';
import type {TTxResponse, TTxStatus} from '@builtbymom/web3/utils/wagmi';
import type {BaseTransaction} from '@gnosis.pm/safe-apps-sdk';
import type {TDisperseTxInfo, TInputWithToken} from '../types/disperse.types';
import type {TTokenAmountInputElement} from '../utils/utils';

export const useSend = (
	txInfo?: TDisperseTxInfo,
	set_disperseStatus?: (value: TTxStatus) => void,
	set_migrateStatus?: (value: TTxStatus) => void
): {onHandleMigration: () => void; migratedTokens: TTokenAmountInputElement[]} => {
	const {safeChainID, chainID} = useChainID();
	const {configuration, dispatchConfiguration} = useSendContext();
	const {isWalletSafe, provider} = useWeb3();
	const {getToken, getBalance, onRefresh} = useWallet();

	const migratedTokens = useDeepCompareMemo(
		() => configuration.inputs.filter(input => input.status === 'success'),
		[configuration.inputs]
	);

	const onUpdateStatus = useCallback(
		(UUID: string, status: 'pending' | 'success' | 'error' | 'none'): void => {
			dispatchConfiguration({
				type: 'SET_VALUE',
				payload: {
					UUID,
					status
				}
			});
		},
		[dispatchConfiguration]
	);

	/**********************************************************************************************
	 ** The handleSuccessCallback is called when a transaction is successful. It will update the
	 ** balances for the token that was transferred and the ETH token. It will also remove the token
	 ** from the selected state.
	 **********************************************************************************************/
	const handleSuccessCallback = useCallback(
		async (tokenAddress: TAddress): Promise<TChainTokens> => {
			const chainCoin = getNetwork(safeChainID).nativeCurrency;
			const tokensToRefresh: TUseBalancesTokens[] = [
				{
					address: ETH_TOKEN_ADDRESS,
					decimals: chainCoin?.decimals || 18,
					symbol: chainCoin?.symbol || 'ETH',
					name: chainCoin?.name || 'Ether',
					chainID: chainID
				}
			];
			const token = getToken({address: tokenAddress, chainID: chainID});
			if (!isZeroAddress(tokenAddress)) {
				tokensToRefresh.push({
					address: tokenAddress,
					decimals: token.decimals,
					symbol: token.symbol,
					name: token.name,
					chainID: chainID
				});
			}

			const updatedBalances = await onRefresh(tokensToRefresh);
			return updatedBalances;
		},
		[safeChainID, chainID, getToken, onRefresh]
	);

	/**********************************************************************************************
	 ** The onMigrateERC20 function is called when the user clicks the 'Migrate' button. This
	 ** function will perform the migration for all the selected tokens, one at a time.
	 **********************************************************************************************/
	const onMigrateERC20 = useCallback(
		async (input?: TInputWithToken, txInfo?: TDisperseTxInfo): Promise<TTxResponse> => {
			const tokenAddress = input?.token.address;
			const inputUUID = input?.UUID;

			inputUUID && onUpdateStatus(inputUUID, 'pending');
			set_disperseStatus?.({...defaultTxStatus, pending: true});

			const result = await transferERC20({
				connector: provider,
				chainID: chainID,
				contractAddress: txInfo?.token.address ?? tokenAddress,
				receiver: txInfo?.receiver ?? configuration.receiver?.address,
				amount: txInfo?.amount.raw ?? (input?.normalizedBigAmount.raw || 0n)
			});

			if (result.isSuccessful) {
				inputUUID && onUpdateStatus(inputUUID, 'success');
				set_disperseStatus?.({...defaultTxStatus, success: result.isSuccessful});
			}
			if (result.error) {
				inputUUID && onUpdateStatus(inputUUID, 'error');
				set_disperseStatus?.({...defaultTxStatus, error: Boolean(result.error)});
			}

			if (tokenAddress) {
				await handleSuccessCallback(tokenAddress);
			}

			if (txInfo?.token.address) {
				await handleSuccessCallback(txInfo?.token.address);
			}
			return result;
		},
		[onUpdateStatus, provider, chainID, configuration.receiver?.address, set_disperseStatus, handleSuccessCallback]
	);

	/**********************************************************************************************
	 ** The onMigrateETH function is called when the user clicks the 'Migrate' button. This
	 ** function will perform the migration for ETH coin.
	 **********************************************************************************************/
	const onMigrateETH = useCallback(
		async (input?: TInputWithToken, txInfo?: TDisperseTxInfo): Promise<TTxResponse> => {
			const inputUUID = input?.UUID;
			inputUUID && onUpdateStatus(inputUUID, 'pending');
			set_disperseStatus?.({...defaultTxStatus, pending: true});

			const ethAmountRaw = input?.normalizedBigAmount.raw ?? txInfo?.amount.raw;

			const isSendingBalance =
				toBigInt(ethAmountRaw) >= toBigInt(getBalance({address: ETH_TOKEN_ADDRESS, chainID: chainID})?.raw);
			const result = await transferEther({
				connector: provider,
				chainID: chainID,
				receiver: configuration.receiver?.address ?? txInfo?.receiver,
				amount: toBigInt(ethAmountRaw),
				shouldAdjustForGas: isSendingBalance
			});
			if (result.isSuccessful) {
				inputUUID && onUpdateStatus(inputUUID, 'success');
			}
			if (result.error) {
				inputUUID && onUpdateStatus(inputUUID, 'error');
			}
			await handleSuccessCallback(ZERO_ADDRESS);
			return result;
		},
		[
			onUpdateStatus,
			set_disperseStatus,
			getBalance,
			chainID,
			provider,
			configuration.receiver?.address,
			handleSuccessCallback
		]
	);

	/**********************************************************************************************
	 ** The onMigrateSelectedForGnosis function is called when the user clicks the 'Migrate' button
	 ** in the Gnosis Safe. This will take advantage of the batch transaction feature of the Gnosis
	 ** Safe.
	 **********************************************************************************************/
	const onMigrateSelectedForGnosis = useCallback(
		async (allSelected: TInputWithToken[], txInfo?: TDisperseTxInfo): Promise<void> => {
			const transactions: BaseTransaction[] = [];

			if (txInfo) {
				return set_disperseStatus?.({...defaultTxStatus, success: true});
			}

			for (const input of allSelected) {
				const amount = toBigInt(input.normalizedBigAmount.raw);
				if (amount === 0n) {
					continue;
				}
				const newTransactionForBatch = getTransferTransaction(
					amount.toString(),
					input.token.address,
					toAddress(configuration.receiver?.address)
				);
				transactions.push(newTransactionForBatch);
			}
			try {
				allSelected.forEach(input => onUpdateStatus(input.UUID, 'pending'));
				allSelected.forEach(input => onUpdateStatus(input.UUID, 'success'));
				set_migrateStatus?.({...defaultTxStatus, success: true});
			} catch (error) {
				set_migrateStatus?.({...defaultTxStatus, error: true});
			}
		},
		[set_disperseStatus, configuration.receiver?.address, set_migrateStatus, onUpdateStatus]
	);

	/**********************************************************************************************
	 ** This is the main function that will be called when the user clicks on the 'Migrate' button.
	 ** It will iterate over the selected tokens and call the onMigrateERC20 function for each
	 ** token.
	 **********************************************************************************************/
	const onHandleMigration = useCallback(async (): Promise<void> => {
		set_migrateStatus?.({...defaultTxStatus, pending: true});

		let areAllSuccess = true;
		let ethToken: TInputWithToken | undefined = undefined;
		const hashMessage: TAddress[] = [];
		const allSelected = configuration.inputs.filter(
			(input): input is TInputWithToken => !!input.token && input.status !== 'success'
		);

		if (isWalletSafe) {
			if (txInfo) {
				return onMigrateSelectedForGnosis([], txInfo);
			}
			return onMigrateSelectedForGnosis(allSelected);
		}

		if (txInfo && isAddressEqual(txInfo.token.address, ETH_TOKEN_ADDRESS)) {
			const result = await onMigrateETH(undefined, txInfo);
			if (result.isSuccessful) {
				return set_disperseStatus?.({...defaultTxStatus, success: true});
			}
			return set_disperseStatus?.({...defaultTxStatus, error: true});
		}

		if (txInfo && !isAddressEqual(txInfo.token.address, ETH_TOKEN_ADDRESS)) {
			const result = await onMigrateERC20(undefined, txInfo);
			if (result.isSuccessful) {
				return set_disperseStatus?.({...defaultTxStatus, success: true});
			}
			return set_disperseStatus?.({...defaultTxStatus, error: true});
		}

		for (const input of allSelected) {
			if (isAddressEqual(input.token.address, ETH_TOKEN_ADDRESS)) {
				ethToken = input; //Migrate ETH at the end
				continue;
			}

			const result = await onMigrateERC20(input);

			if (result.isSuccessful && result.receipt) {
				hashMessage.push(result.receipt.transactionHash);
			} else {
				areAllSuccess = false;
			}
		}

		const ethAmountRaw = ethToken?.normalizedBigAmount?.raw;

		if (ethToken && toBigInt(ethAmountRaw) > 0n) {
			const result = await onMigrateETH(ethToken);
			if (result.isSuccessful && result.receipt) {
				hashMessage.push(result.receipt.transactionHash);
			} else {
				areAllSuccess = false;
			}
		}

		if (areAllSuccess) {
			set_migrateStatus?.({...defaultTxStatus, success: true});
		} else {
			set_migrateStatus?.({...defaultTxStatus, error: true});
		}
	}, [
		set_migrateStatus,
		configuration.inputs,
		isWalletSafe,
		txInfo,
		onMigrateSelectedForGnosis,
		onMigrateETH,
		set_disperseStatus,
		onMigrateERC20
	]);
	return {onHandleMigration, migratedTokens};
};
