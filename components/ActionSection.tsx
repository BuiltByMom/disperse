import {type ReactElement, useCallback, useMemo, useState} from 'react';
import {erc20Abi, zeroAddress} from 'viem';
import {useReadContract} from 'wagmi';
import useWallet from '@builtbymom/web3/contexts/useWallet';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {
	cl,
	ETH_TOKEN_ADDRESS,
	formatAmount,
	isZeroAddress,
	toAddress,
	toBigInt,
	toNormalizedValue,
	zeroNormalizedBN
} from '@builtbymom/web3/utils';
import {approveERC20, defaultTxStatus} from '@builtbymom/web3/utils/wagmi';

import {Button} from './common/Button';
import {useDisperse} from './common/contexts/useDisperse';
import {ErrorModal} from './common/ErrorModal';
import {useConfirmDisperse} from './common/hooks/useConfirmDisperse';
import {useSend} from './common/hooks/useSend';
import {SuccessModal} from './common/SuccessModal';

import type {TTxStatus} from '@builtbymom/web3/utils/wagmi';

import {CHAINS} from '@/utils/tools.chains';

type TApprovalWizardProps = {
	onSuccess: () => void;
	totalToDisperse: bigint;
};

const useApproveDisperse = ({
	onSuccess,
	totalToDisperse
}: TApprovalWizardProps): {
	approvalStatus: TTxStatus;
	shouldApprove: boolean;
	allowance: bigint;
	isApproved: boolean;
	isDisabled: boolean;
	onApproveToken: () => Promise<void>;
	shouldUseSend: boolean;
	refetch: VoidFunction;
} => {
	const {provider} = useWeb3();
	const {safeChainID, chainID} = useChainID();
	const {configuration} = useDisperse();
	const [approvalStatus, set_approvalStatus] = useState(defaultTxStatus);
	const {address} = useWeb3();

	const shouldApprove = useMemo((): boolean => {
		return toAddress(configuration.tokenToSend?.address) !== ETH_TOKEN_ADDRESS;
	}, [configuration.tokenToSend]);

	const {data: allowance = 0n, refetch} = useReadContract({
		abi: erc20Abi,
		functionName: 'allowance',
		args: [toAddress(address), CHAINS[safeChainID].disperseAddress],
		address: toAddress(configuration.tokenToSend?.address),
		query: {
			enabled:
				configuration.tokenToSend !== undefined &&
				toAddress(configuration.tokenToSend?.address) !== ETH_TOKEN_ADDRESS
		}
	});

	const isApproved = allowance >= totalToDisperse;
	const shouldUseSend = configuration.inputs.length === 1;
	const onApproveToken = useCallback(async (): Promise<void> => {
		if (isApproved || !shouldApprove) {
			return;
		}
		await approveERC20({
			connector: provider,
			chainID: chainID,
			contractAddress: toAddress(configuration.tokenToSend?.address),
			spenderAddress: CHAINS[safeChainID].disperseAddress,
			amount: totalToDisperse,
			statusHandler: set_approvalStatus
		}).then(result => {
			if (result.isSuccessful) {
				onSuccess();
				refetch();
			}
		});
	}, [
		isApproved,
		shouldApprove,
		provider,
		chainID,
		configuration.tokenToSend?.address,
		safeChainID,
		totalToDisperse,
		onSuccess,
		refetch
	]);

	return {
		approvalStatus,
		shouldApprove,
		allowance,
		isApproved,
		isDisabled: !approvalStatus.none || !configuration.tokenToSend,
		onApproveToken,
		shouldUseSend,
		refetch
	};
};

export function ActionSection(): ReactElement | null {
	const {address, onConnect, isWalletSafe} = useWeb3();
	const {configuration, dispatchConfiguration} = useDisperse();
	const {safeChainID} = useChainID();
	const [disperseStatus, set_disperseStatus] = useState(defaultTxStatus);
	const {getBalance} = useWallet();

	/**********************************************************************************************
	 ** totalToDisperse function calculates the total amount to disperse by summing the normalized
	 ** values of all input rows in the configuration. It is memoized with useMemo to optimize
	 ** performance and only recalculates when the inputs change.
	 *********************************************************************************************/
	const totalToDisperse = useMemo((): bigint => {
		return configuration.inputs.reduce((acc, row): bigint => acc + row.value.normalizedBigAmount.raw, 0n) ?? 0;
	}, [configuration.inputs]);

	const {isApproved, refetch, approvalStatus, onApproveToken, shouldUseSend} = useApproveDisperse({
		onSuccess: () => {
			set_disperseStatus(defaultTxStatus);
		},
		totalToDisperse
	});

	const {onHandleMigration} = useSend(
		{
			receiver: configuration?.inputs[0]?.receiver.address || zeroAddress,
			amount: configuration?.inputs[0]?.value.normalizedBigAmount,
			token: {
				address: configuration.tokenToSend?.address || zeroAddress,
				name: configuration?.tokenToSend?.name || '',
				symbol: configuration?.tokenToSend?.symbol || '',
				decimals: configuration?.tokenToSend?.decimals || 18,
				chainID: configuration?.tokenToSend?.chainID || safeChainID,
				value: configuration?.tokenToSend?.value || 0,
				balance: configuration?.tokenToSend?.balance || zeroNormalizedBN
			}
		},
		set_disperseStatus
	);

	const onSendSingleToken = (): void => {
		onHandleMigration();
		// plausible(PLAUSIBLE_EVENTS.DISPERSE_TOKENS, {
		// 	props: {
		// 		disperseChainID: safeChainID,
		// 		numberOfReceivers: 1,
		// 		tokenToDisperse: configuration.tokenToSend?.address,
		// 		totalToDisperse: `${formatAmount(
		// 			toNormalizedValue(totalToDisperse, configuration.tokenToSend?.decimals || 18),
		// 			6,
		// 			configuration.tokenToSend?.decimals || 18
		// 		)} ${configuration.tokenToSend?.symbol || 'Tokens'}`
		// 	}
		// });
	};

	const {onDisperseTokens} = useConfirmDisperse({
		onError: () => {
			set_disperseStatus({...defaultTxStatus, error: true});
		},
		onSuccess: () => {
			set_disperseStatus({...defaultTxStatus, success: true});
		},
		onTrigger: () => {
			set_disperseStatus({...defaultTxStatus, pending: true});
		}
	});

	/**********************************************************************************************
	 ** handleApprove function is designed to call 2 transactions one by one. First we call
	 ** approve function then we disperse tokens.
	 *********************************************************************************************/
	const handleApprove = useCallback(async () => {
		await onApproveToken();
		await refetch();
		await onDisperseTokens();
	}, [onApproveToken, onDisperseTokens, refetch]);

	const isAboveBalance =
		totalToDisperse >
		getBalance({
			address: toAddress(configuration.tokenToSend?.address),
			chainID: Number(configuration.tokenToSend?.chainID)
		}).raw;

	const isValid = useMemo((): boolean => {
		return configuration.inputs.every((row): boolean => {
			if (!row.receiver.label && !row.receiver.address && toBigInt(row.value.normalizedBigAmount.raw) === 0n) {
				return false;
			}
			if (!row.receiver.address || isZeroAddress(row.receiver.address)) {
				return false;
			}
			if (!row.value.normalizedBigAmount || row.value.normalizedBigAmount.raw === 0n) {
				return false;
			}
			if (isAboveBalance) {
				return false;
			}
			return true;
		});
	}, [configuration.inputs, isAboveBalance]);

	/**********************************************************************************************
	 ** isButtonDisabled function determines whether the button should be disabled based on the
	 ** presence of a selected token address and the total amount to disperse. It returns true if
	 ** either condition is not met and is memoized to optimize performance.
	 *********************************************************************************************/
	const isButtonDisabled = useMemo((): boolean => {
		if (!address) {
			return false;
		}
		return !configuration.tokenToSend?.address || totalToDisperse === BigInt(0) || !isValid;
	}, [address, configuration.tokenToSend?.address, totalToDisperse, isValid]);

	/**********************************************************************************************
	 ** getTotalToDisperse function returns a formatted string representing the total amount to
	 ** disperse. It checks if the wallet is connected and if a token is selected, and formats
	 ** the total amount with the appropriate number of decimals. It uses useCallback to avoid
	 ** unnecessary recalculations.
	 *********************************************************************************************/
	const getTotalToDisperse = useCallback((): string => {
		if (!address) {
			return 'Wallet not connected';
		}
		if (!configuration.tokenToSend?.address) {
			return 'Token not selected';
		}
		return `${formatAmount(
			toNormalizedValue(totalToDisperse, configuration.tokenToSend?.decimals || 18),
			4,
			configuration.tokenToSend?.decimals || 18
		)} ${configuration.tokenToSend?.symbol || configuration.tokenToSend?.name}`;
	}, [
		address,
		configuration.tokenToSend?.address,
		configuration.tokenToSend?.decimals,
		configuration.tokenToSend?.name,
		configuration.tokenToSend?.symbol,
		totalToDisperse
	]);

	/**********************************************************************************************
	 ** getButtonTitle function returns a string for the button's title based on whether the wallet
	 ** is connected. It returns 'Connect wallet' if the wallet is not connected, and 'Approve
	 ** and Disperse' otherwise.
	 *********************************************************************************************/
	const getButtonTitle = (): string => {
		if (!address) {
			return 'Connect wallet';
		}
		if (
			shouldUseSend ||
			isWalletSafe ||
			toAddress(configuration.tokenToSend?.address) === ETH_TOKEN_ADDRESS ||
			isApproved
		) {
			return 'Disperse';
		}
		return 'Disperse';
	};

	/**********************************************************************************************
	 ** onAction function handles the main action of the component based on the current state.
	 ** It checks if the wallet is connected, if a single token should be sent, if the token is
	 ** approved, and calls the appropriate function accordingly. The function either connects
	 ** the wallet, sends a single token, disperses tokens, or handles token approval.
	 *********************************************************************************************/
	const onAction = async (): Promise<void> => {
		if (!address) {
			return onConnect();
		}
		if (shouldUseSend) {
			return onSendSingleToken();
		}

		if (isApproved) {
			return onDisperseTokens();
		}
		return handleApprove();
	};

	if (configuration.inputs.length < 1) {
		return null;
	}

	return (
		<div
			className={cl(
				'mt-10 flex flex-col w-full md:w-auto gap-7 rounded-t-3xl bg-accent px-6 py-10',
				'md:mb-20 md:grid md:size-full md:grid-cols-3 md:rounded-3xl md:px-16 md:py-[60px]'
			)}>
			<div className={'flex flex-col items-start justify-start gap-2'}>
				<span className={'font-medium text-secondary'}>{'Total to Disperse:'}</span>
				<h2 className={'font-medium text-secondary'}>{getTotalToDisperse()}</h2>
			</div>
			<div className={'flex w-full flex-col items-start gap-2'}>
				<span className={'text-start font-medium text-secondary'}>{'Total receivers:'}</span>
				<h2 className={'font-medium text-secondary'}>{configuration.inputs.length}</h2>
			</div>
			<div className={'flex'}>
				<Button
					onClick={onAction}
					isBusy={approvalStatus.pending || disperseStatus.pending}
					isDisabled={isButtonDisabled}>
					<span>{getButtonTitle()}</span>
				</Button>
			</div>

			<SuccessModal
				isOpen={disperseStatus.success}
				totalToDisperse={getTotalToDisperse()}
				onClose={() => {
					set_disperseStatus({...defaultTxStatus, none: true});
					dispatchConfiguration({type: 'RESET', payload: undefined});
				}}
			/>

			<ErrorModal
				onClose={() => {
					set_disperseStatus({...defaultTxStatus, none: true});
				}}
				isOpen={disperseStatus.error}
			/>
		</div>
	);
}
