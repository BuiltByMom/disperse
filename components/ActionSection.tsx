import {type ReactElement, useCallback, useMemo} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl, formatAmount, toNormalizedValue} from '@builtbymom/web3/utils';

import {useDisperse} from './common/contexts/useDisperse';

export function ActionSection(): ReactElement | null {
	const {address, onConnect} = useWeb3();
	const {configuration} = useDisperse();

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const totalToDisperse = useMemo((): bigint => {
		return configuration.inputs.reduce((acc, row): bigint => acc + row.value.normalizedBigAmount.raw, 0n) ?? 0;
	}, [configuration.inputs]);

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const isButtonDisabled = useMemo((): boolean => {
		if (!configuration.tokenToSend?.address || totalToDisperse === BigInt(0)) {
			return true;
		}
		return false;
	}, [configuration.tokenToSend?.address, totalToDisperse]);

	/**********************************************************************************************
	 ** TODO: write comment of what it does
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
		)} ${configuration.tokenToSend?.symbol}`;
	}, [address, configuration.tokenToSend?.address, configuration.tokenToSend?.decimals, configuration.tokenToSend?.symbol, totalToDisperse]);

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const getButtonTitle = (): string => {
		if (!address) {
			return 'Connect wallet';
		}
		return 'Approve and Disperse';
	};

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const onAction = (): void => {
		if (!address) {
			onConnect();
		}
	};

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	if (configuration.inputs.length < 1) {
		return null;
	}

	return (
		<div className={'mb-40 mt-20 grid w-full grid-cols-3 gap-7 rounded-3xl bg-accent md:px-16 md:py-[60px]'}>
			<div className={'flex flex-col items-start justify-start gap-2'}>
				<span className={'text-base font-medium'}>{'Total to Disperse:'}</span>
				<span className={'text-[32px] font-medium leading-[32px]'}>{getTotalToDisperse()}</span>
			</div>
			<div className={'flex w-full flex-col items-start gap-2'}>
				<span className={'text-start text-base font-medium'}>{'Total receivers:'}</span>
				<span className={'text-[32px] font-medium leading-[32px]'}>{configuration.inputs.length}</span>
			</div>
			<div className={'flex '}>
				<button
					onClick={onAction}
					disabled={isButtonDisabled}
					className={cl(
						'col-span-1 w-full items-center rounded-3xl bg-secondary text-center text-base text-primary',
						'disabled:text-primary/70 disabled:bg-secondary/90 disabled:cursor-not-allowed'
					)}>
					{getButtonTitle()}
				</button>
			</div>
		</div>
	);
}
