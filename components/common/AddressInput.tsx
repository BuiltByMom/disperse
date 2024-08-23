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
	 ** onChange function handles input changes by aborting any ongoing actions, setting the new
	 ** value with the provided input, and then executing the necessary actions based on the updated input.
	 *********************************************************************************************/
	const onChange = (input: string): void => {
		actions.abort();
		onSetValue({label: input});
		actions.execute(input);
	};

	/**********************************************************************************************
	 ** getInputValue function returns the appropriate input value based on the focus state and
	 ** the format of the input. If focused, it returns the full input label. If the input is an
	 ** address, it returns a truncated version of the address. Otherwise, it returns the label as is.
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
	 ** useEffect hook updates the component's value when the result changes. If a valid result is
	 ** present, it triggers the onSetValue function with the new result. The effect only runs
	 ** when the result dependency changes.
	 *********************************************************************************************/
	useEffect(() => {
		if (!result) {
			return;
		}
		onSetValue(result);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [result]);

	/**********************************************************************************************
	 ** onFocusInput function manages the focus state of an input element. If the input is not
	 ** already focused, it sets the focus state to true and, after a brief delay, selects the
	 ** entire input text and scrolls to the end of the input. If the input is already focused,
	 ** it simply ensures the focus state remains true.
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
		<label
			className={cl(
				'h-14 rounded-2xl border px-4 py-2',
				isTouched && value.label && (value.error || !value.isValid || value.isValid === 'undetermined')
					? 'border-fail'
					: 'border-primary/10'
			)}>
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
				value={
					isAddress(value?.address) && toAddress(value.address)
						? truncateHex(value.address, 6)
						: value.error || ''
				}
				className={cl(
					'text-primary/40',
					isFocused ? 'hidden' : 'block',
					isFocused ? 'translate-y-8' : 'translate-y-0',
					'pointer-events-none',
					value.error || !value.isValid || value.isValid === 'undetermined'
						? '!text-fail'
						: 'text-neutral-600'
				)}
			/>
		</label>
	);
}
