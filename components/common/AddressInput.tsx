import {type ReactElement, type RefObject, useCallback, useEffect, useState} from 'react';
import {cl, isAddress, toAddress, truncateHex} from '@builtbymom/web3/utils';
import {useAsyncAbortable} from '@react-hookz/web';

import {TextTruncate} from './TextTruncate';
import {useValidateAddressInput} from './hooks/useValidateAddressInput';
import {type TInputAddressLike} from './utils/tools.address'; 

export function AddressInput({
	value,
	onSetValue, 
	inputRef
}: {
	value: TInputAddressLike;
	onSetValue: (value: Partial<TInputAddressLike>) => void; 
	inputRef: RefObject<HTMLInputElement>;
}): ReactElement {
	const [isFocused, set_isFocused] = useState(false);
	const [isTouched, set_isTouched] = useState(false);
	const {validate} = useValidateAddressInput();
	const [{result}, actions] = useAsyncAbortable(validate, undefined);


	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const onChange = (input: string): void => {
		actions.abort();
		onSetValue({label: input});
		actions.execute(input);
	};

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const getInputValue = useCallback((): string | undefined => {
		if (isFocused) {
			return value.label;
		}

		if (isAddress(value.label)) {
			return truncateHex(value.label, 5);
		}

		return value.label;
	}, [isFocused, value.label]);


	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	useEffect(() => {
		if (!result) {
			return;
		}
		onSetValue(result);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [result]);

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const onFocusInput = useCallback(() => {
		if (!isFocused) {
			set_isFocused(true);
			setTimeout(() => {
				if (inputRef.current) {
					const end = value.label.length;
					inputRef.current.setSelectionRange(0, end);
					inputRef.current.scrollLeft = inputRef.current.scrollWidth;
					inputRef.current.focus();
				}
			}, 0);
		} else {
			set_isFocused(true);
		}
	}, [inputRef, isFocused, value.label.length]);

	return (
		<label className={cl('h-14 rounded-2xl border px-4 py-2', isTouched && value.label && (value.error || !value.isValid || value.isValid === 'undetermined') ? 'border-fail' : 'border-primary/10')}>
			<input
				// ref={inputRef}
				className={cl(
					'w-full text-primary bg-transparent ext-base transition-all ',
					'placeholder:text-neutral-600',
					'focus:placeholder:text-neutral-300 placeholder:transition-colors',
					'focus:outline-0',
					isFocused || !value.label ? 'mt-2' : 'mt-0'
				)}
				type={'text'}
				placeholder={'0x...'}
				autoComplete={'off'}
				autoCorrect={'off'}
				spellCheck={'false'}
				value={getInputValue()}
				onChange={e => {
					onChange(e.target.value);
				}}
				onFocus={onFocusInput}
				onBlur={() => {
					set_isTouched(true);
					set_isFocused(false);
				}}
			/>
			<TextTruncate
				value={(isAddress(value?.address)) && toAddress(value.address) ? truncateHex(value.address, 6) : value.error || ''}
				className={cl(
					'text-primary/40',
					isFocused ? 'hidden' : 'block',
					isFocused ? 'translate-y-8' : 'translate-y-0',
					'pointer-events-none',
					value.error || !value.isValid || value.isValid === 'undetermined' ? '!text-fail' : 'text-neutral-600'
				)}
			/>

		</label>
	);
}
