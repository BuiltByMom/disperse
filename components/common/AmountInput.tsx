import {type ReactElement,useCallback, useState} from 'react';
import React from 'react';
import InputNumber from 'rc-input-number';
import {cl} from '@builtbymom/web3/utils'; 
import {useDeepCompareEffect, useUpdateEffect} from '@react-hookz/web';

import {useDisperse} from './contexts/useDisperse';
import {useValidateAmountInput} from './hooks/useValidateAmountInput';

import type {TNormalizedBN,TToken} from '@builtbymom/web3/types';
import type {TAmountInputElement} from './types/disperse.types';
 
type TAmountInput = {
	onSetValue: (value: Partial<TAmountInputElement>) => void;
	value: TAmountInputElement;
	token: TToken | undefined; 
	price?: TNormalizedBN | undefined;
};

export function AmountInput({value, token, onSetValue}: TAmountInput): ReactElement {
	const {configuration} = useDisperse();

	const [isFocused, set_isFocused] = useState<boolean>(false);
	const {result, validate} = useValidateAmountInput();

	const getBorderColor = useCallback((): string => {
		if (isFocused) {
			return 'border-neutral-600';
		}
		if (value.isValid === false) {
			return 'border-red';
		}
		return 'border-neutral-400';
	}, [isFocused, value.isValid]);

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
		<label className={'border-primary/10 h-14 rounded-2xl border px-4 py-2'}> 
			<InputNumber
				// ref={inputRef}
				value={value.amount}
				prefixCls={cl(
					'w-full -mb-[3px] !bg-transparent text-base transition-all',
					'text-primary placeholder:text-primary/40 active:outline-0',
					'focus:placeholder:text-neutral-300 placeholder:transition-colors',
					'focus:border-primary/10 focus:outline-0',
					'placeholder:transition-colors overflow-hidden',
					getBorderColor(),
					!value.amount ? 'mt-2' : 'mt-0'

				)}
				min={'0'}
				step={0.1}
				decimalSeparator={'.'}
				placeholder={'0.00'}
				autoComplete={'off'} 
				autoCorrect={'off'}
				spellCheck={'false'}
				onChange={value => validate(value || '', token)}
				onFocus={() => set_isFocused(true)}
				onBlur={() => set_isFocused(false)}
			/>
			{!configuration.tokenToSend && <span className={'text-primary/40 text-xs'}>{'Token not selected'}</span>}
		</label>
	);
}
