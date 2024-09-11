import {useCallback, useMemo, useState} from 'react';
import {erc20Abi} from 'viem';
import {useReadContract} from 'wagmi';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {ETH_TOKEN_ADDRESS, toAddress} from '@builtbymom/web3/utils';
import {approveERC20, defaultTxStatus, type TTxStatus} from '@builtbymom/web3/utils/wagmi';

import {useDisperse} from '../contexts/useDisperse';

import {CHAINS} from '@/components/common/utils/tools.chains';

type TApproveDisperse = {
	onSuccess: VoidFunction;
	totalToDisperse: bigint;
};

export function useApproveDisperse({onSuccess, totalToDisperse}: TApproveDisperse): {
	approveStatus: TTxStatus;
	shouldApprove: boolean;
	allowance: bigint;
	isApproved: boolean;
	isDisabled: boolean;
	onApproveToken: () => Promise<void>;
	shouldUseSend: boolean;
	refetch: VoidFunction;
} {
	const {provider, address} = useWeb3();
	const {safeChainID, chainID} = useChainID();
	const {configuration} = useDisperse();
	const [approveStatus, set_approveStatus] = useState(defaultTxStatus);

	const shouldApprove = useMemo(
		() => toAddress(configuration.tokenToSend?.address) !== ETH_TOKEN_ADDRESS,
		[configuration.tokenToSend?.address]
	);

	const {data: allowance = 0n, refetch} = useReadContract({
		abi: erc20Abi,
		functionName: 'allowance',
		args: [toAddress(address), CHAINS[safeChainID].disperseAddress],
		address: toAddress(configuration.tokenToSend?.address),
		query: {
			enabled:
				configuration.tokenToSend !== undefined &&
				toAddress(configuration.tokenToSend.address) !== ETH_TOKEN_ADDRESS
		}
	});

	const isApproved = allowance >= totalToDisperse;
	const shouldUseSend = configuration.inputs.length === 1;
	const onApproveToken = useCallback(async (): Promise<void> => {
		if (!shouldApprove || isApproved) {
			return;
		}
		await approveERC20({
			connector: provider,
			chainID: chainID,
			contractAddress: toAddress(configuration.tokenToSend?.address),
			spenderAddress: CHAINS[safeChainID].disperseAddress,
			amount: totalToDisperse,
			statusHandler: set_approveStatus
		}).then(result => {
			if (result.isSuccessful) {
				onSuccess();
				refetch();
			}
		});
	}, [
		chainID,
		configuration.tokenToSend?.address,
		isApproved,
		onSuccess,
		provider,
		refetch,
		safeChainID,
		shouldApprove,
		totalToDisperse
	]);

	return {
		approveStatus,
		shouldApprove,
		allowance,
		isApproved,
		isDisabled: !approveStatus.none || !configuration.tokenToSend,
		onApproveToken,
		shouldUseSend,
		refetch
	};
}
