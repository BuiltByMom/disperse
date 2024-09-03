import {type ReactElement, useCallback, useMemo} from 'react';
import React from 'react';
import InputNumber from 'rc-input-number';
import {cl, formatAmount, toAddress, toBigInt} from '@builtbymom/web3/utils';
import {useDeepCompareEffect, useUpdateEffect} from '@react-hookz/web';

import {useDisperse} from './contexts/useDisperse';
import {usePrices} from './contexts/usePrices';
import {useValidateAmountInput} from './hooks/useValidateAmountInput';

import type {TNormalizedBN, TToken} from '@builtbymom/web3/types';
import type {TAmountInputElement} from './types/disperse.types';

import {APP_CHAIN_ID} from '@/constants';

type TAmountInput = {
	onSetValue: (value: Partial<TAmountInputElement>) => void;
	value: TAmountInputElement;
	token: TToken | undefined;
	price?: TNormalizedBN | undefined;
};

export function AmountInput({value, token, onSetValue}: TAmountInput): ReactElement {
	const {configuration} = useDisperse();

	const {result, validate} = useValidateAmountInput();
	const {getPrice} = usePrices();
	const price = getPrice({chainID: APP_CHAIN_ID, address: toAddress(token?.address)});

	const getError = (): ReactElement => {
		if (!configuration.tokenToSend?.address) {
			return <span className={'mb-1 text-xs text-primary/40'}>{'Token not selected'}</span>;
		}
		if (value.error) {
			return <p className={'mt-1 text-xs text-fail'}>{value.error}</p>;
		}
		return <p className={cl('text-xs', 'text-primary/40 mt-1')}>{amountValue}</p>;
	};

	/**********************************************************************************************
	 ** getBorderColor function determines the border color of an element based on its focus state
	 ** and validity.
	 *********************************************************************************************/
	const getBorderColor = useCallback((): string => {
		if (value.isValid === false) {
			return 'border-fail';
		}

		return 'border-primary/10';
	}, [value.isValid]);

	/**********************************************************************************************
	 ** The amountValue memoized value contains the string representation of the token value,
	 ** in USD. If the token value is zero, it will display 'N/A'.
	 *********************************************************************************************/
	const amountValue = useMemo(() => {
		if (!token) {
			return 'N/A';
		}
		if (toBigInt(price?.raw) === 0n) {
			return 'N/A';
		}

		const formatedValue = formatAmount(value.amount ?? '', 2);
		return `$${formatedValue}`;
	}, [price?.raw, token, value.amount]);

	/** Set the validation result to the context */
	useDeepCompareEffect(() => {
		if (!result) {
			return;
		}
		onSetValue(result);
	}, [result]);

	/** Validate the field when token changes. Only filled inputs should be validated */
	useUpdateEffect(() => {
		if (!value.amount) {
			return;
		}
		validate(value.amount, token);
	}, [token?.address]);

	return (
		<label className={cl('h-14 rounded-2xl border px-4 pb-1', getBorderColor())}>
			<InputNumber
				value={value.amount}
				prefixCls={cl(
					'w-full -mb-[3px] !bg-transparent transition-all',
					'text-primary placeholder:text-primary/40 active:outline-0',
					'focus:placeholder:text-neutral-300 placeholder:transition-colors',
					'focus:border-primary/10 focus:outline-0',
					'placeholder:transition-colors overflow-hidden',
					'mt-2'
				)}
				min={'0'}
				step={0.1}
				decimalSeparator={'.'}
				placeholder={'0.00'}
				autoComplete={'off'}
				autoCorrect={'off'}
				spellCheck={'false'}
				onChange={value => validate(value || '', token)}
			/>

			{getError()}
		</label>
	);
}
