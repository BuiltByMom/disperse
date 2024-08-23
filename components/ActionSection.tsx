import {type ReactElement, useCallback, useMemo} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl, formatAmount, toNormalizedValue} from '@builtbymom/web3/utils';

import {useDisperse} from './common/contexts/useDisperse';

export function ActionSection(): ReactElement | null {
	const {address, onConnect} = useWeb3();
	const {configuration} = useDisperse();

	/**********************************************************************************************
	 ** totalToDisperse function calculates the total amount to disperse by summing the normalized
	 ** values of all input rows in the configuration. It is memoized with useMemo to optimize
	 ** performance and only recalculates when the inputs change.
	 *********************************************************************************************/
	const totalToDisperse = useMemo((): bigint => {
		return configuration.inputs.reduce((acc, row): bigint => acc + row.value.normalizedBigAmount.raw, 0n) ?? 0;
	}, [configuration.inputs]);

	/**********************************************************************************************
	 ** isButtonDisabled function determines whether the button should be disabled based on the
	 ** presence of a selected token address and the total amount to disperse. It returns true if
	 ** either condition is not met and is memoized to optimize performance.
	 *********************************************************************************************/
	const isButtonDisabled = useMemo((): boolean => {
		if (!configuration.tokenToSend?.address || totalToDisperse === BigInt(0)) {
			return true;
		}
		return false;
	}, [configuration.tokenToSend?.address, totalToDisperse]);

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
		)} ${configuration.tokenToSend?.symbol}`;
	}, [
		address,
		configuration.tokenToSend?.address,
		configuration.tokenToSend?.decimals,
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

	if (configuration.inputs.length < 1) {
		return null;
	}

	return (
		<div
			className={cl(
				'mt-20 flex flex-col w-full md:w-auto gap-7 rounded-t-3xl bg-accent px-6 py-10',
				'md:mb-40 md:grid md:size-full md:grid-cols-3 md:rounded-3xl md:px-16 md:py-[60px]'
			)}>
			<div className={'flex flex-col items-start justify-start gap-2'}>
				<span className={'text-base font-medium'}>{'Total to Disperse:'}</span>
				<span className={'text-[32px] font-medium leading-[32px]'}>{getTotalToDisperse()}</span>
			</div>
			<div className={'flex w-full flex-col items-start gap-2'}>
				<span className={'text-start text-base font-medium'}>{'Total receivers:'}</span>
				<span className={'text-[32px] font-medium leading-[32px]'}>{configuration.inputs.length}</span>
			</div>
			<div className={'flex'}>
				<button
					onClick={onAction}
					disabled={isButtonDisabled}
					className={cl(
						'col-span-1 w-full h-16 items-center rounded-3xl bg-secondary text-center text-base text-primary',
						'disabled:text-primary/70 disabled:bg-secondary/90 disabled:cursor-not-allowed'
					)}>
					{getButtonTitle()}
				</button>
			</div>
		</div>
	);
}
