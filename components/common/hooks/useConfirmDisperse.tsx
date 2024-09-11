import {useCallback} from 'react';
import useWallet from '@builtbymom/web3/contexts/useWallet';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {ETH_TOKEN_ADDRESS, isZeroAddress, toAddress, toBigInt, ZERO_ADDRESS} from '@builtbymom/web3/utils';
import {useSafeAppsSDK} from '@gnosis.pm/safe-apps-react-sdk';

import {useDisperse} from '../contexts/useDisperse';
import {disperseERC20, disperseETH} from '../utils/actions';
import {getTransferTransaction} from '../utils/tools.gnosis';

import type {TAddress} from '@builtbymom/web3/types';
import type {BaseTransaction} from '@gnosis.pm/safe-apps-sdk';

import {CHAINS} from '@/components/common/utils/tools.chains';

export function useConfirmDisperse({
	onTrigger,
	onSuccess,
	onError
}: {
	onTrigger: () => void;
	onSuccess: () => void;
	onError: () => void;
}): {onDisperseTokens: () => void} {
	const {provider, isWalletSafe} = useWeb3();
	const {chainID, safeChainID} = useChainID();
	const {configuration} = useDisperse();
	const {onRefresh} = useWallet();
	const {sdk} = useSafeAppsSDK();

	const successDisperseCallback = useCallback(() => {
		onSuccess();
		onRefresh([
			{
				decimals: configuration.tokenToSend?.decimals,
				name: configuration.tokenToSend?.name,
				symbol: configuration.tokenToSend?.symbol,
				address: toAddress(configuration.tokenToSend?.address),
				chainID: Number(configuration.tokenToSend?.chainID)
			}
		]);

		// plausible(PLAUSIBLE_EVENTS.DISPERSE_TOKENS, {
		// 	props: {
		// 		disperseChainID: safeChainID,
		// 		numberOfReceivers: disperseAddresses.length,
		// 		tokenToDisperse: configuration.tokenToSend?.address,
		// 		totalToDisperse: `${formatAmount(
		// 			toNormalizedValue(totalToDisperse, configuration.tokenToSend?.decimals || 18),
		// 			6,
		// 			configuration.tokenToSend?.decimals || 18
		// 		)} ${configuration.tokenToSend?.symbol || 'Tokens'}`
		// 	}
		// });
		return;
	}, [configuration.tokenToSend, onRefresh, onSuccess]);
	/**********************************************************************************************
	 ** onDisperseTokensForGnosis will do just like disperseTokens but for Gnosis Safe and without
	 ** the use of a smartcontract. It will just batch standard transfers.
	 **********************************************************************************************/
	const onDisperseTokensForGnosis = useCallback((): void => {
		const transactions: BaseTransaction[] = [];
		const disperseAddresses: TAddress[] = [];
		const disperseAmount: bigint[] = [];
		for (const row of configuration.inputs) {
			if (!row.value.amount || row.value.normalizedBigAmount.raw === 0n) {
				continue;
			}
			if (
				!row.receiver.address ||
				row.receiver.address === ZERO_ADDRESS ||
				row.receiver.address === ETH_TOKEN_ADDRESS
			) {
				continue;
			}
			disperseAddresses.push(row.receiver.address);
			disperseAmount.push(row.value.normalizedBigAmount.raw);
			const newTransactionForBatch = getTransferTransaction(
				row.value.normalizedBigAmount.raw.toString(),
				toAddress(configuration.tokenToSend?.address),
				row.receiver.address
			);
			transactions.push(newTransactionForBatch);
		}
		try {
			sdk.txs.send({txs: transactions}).then(() => {
				// toast.success('Your transaction has been created! You can now sign and execute it!');

				onSuccess();
			});
		} catch (error) {
			// toast.error((error as BaseError)?.message || 'An error occured while creating your transaction!');
			onError();
		}
	}, [configuration.inputs, configuration.tokenToSend, sdk.txs, onSuccess, onError]);

	const onDisperseTokens = useCallback((): void => {
		onTrigger();
		if (isWalletSafe) {
			return onDisperseTokensForGnosis();
		}

		const [disperseAddresses, disperseAmount] = configuration.inputs
			.filter((row): boolean => {
				return (
					(toBigInt(row.value.normalizedBigAmount.raw) > 0n &&
						row.receiver.address &&
						!isZeroAddress(row.receiver.address)) ||
					false
				);
			})
			.reduce(
				(acc, row): [TAddress[], bigint[]] => {
					acc[0].push(toAddress(row.receiver.address));
					acc[1].push(toBigInt(row.value.normalizedBigAmount.raw));
					return acc;
				},
				[[] as TAddress[], [] as bigint[]]
			);

		if (configuration.tokenToSend?.address === ETH_TOKEN_ADDRESS) {
			disperseETH({
				connector: provider,
				chainID: chainID,
				contractAddress: CHAINS[safeChainID].disperseAddress,
				receivers: disperseAddresses,
				amounts: disperseAmount
			}).then(result => {
				if (result.isSuccessful) {
					return successDisperseCallback();
				}
				onError();
			});
		} else {
			disperseERC20({
				connector: provider,
				chainID: chainID,
				contractAddress: CHAINS[safeChainID].disperseAddress,
				tokenToDisperse: toAddress(configuration.tokenToSend?.address),
				receivers: disperseAddresses,
				amounts: disperseAmount
			}).then(result => {
				if (result.isSuccessful) {
					return successDisperseCallback();
				}
				onError();
			});
		}
	}, [
		onTrigger,
		isWalletSafe,
		configuration.inputs,
		configuration.tokenToSend?.address,
		onDisperseTokensForGnosis,
		provider,
		safeChainID,
		chainID,
		onError,
		successDisperseCallback
	]);

	return {onDisperseTokens};
}
