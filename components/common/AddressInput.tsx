import {type ReactElement, useCallback, useState} from 'react';
import {cl, isAddress, truncateHex} from '@builtbymom/web3/utils';

import {type TInputAddressLike} from './utils/tools.address';

export function AddressInput({
	value,
	onSetValue
}: {
	value: TInputAddressLike;
	onSetValue: (value: Partial<TInputAddressLike>) => void;
}): ReactElement {
	const [isFocused, set_isFocused] = useState(false);

	const onFocusInput = (): void => {
		set_isFocused(true);
	};

	const onChange = (input: string): void => {
		onSetValue({label: input});
	};

	const getInputValue = useCallback((): string | undefined => {
		if (isFocused) {
			return value.label;
		}

		if (isAddress(value.label)) {
			return truncateHex(value.label, 5);
		}

		return value.label;
	}, [isFocused, value.label]);

	return (
		<input
			// ref={inputRef}
			className={cl(
				'w-full text-primary rounded-2xl h-14 border border-primary/10 bg-transparent px-4 py-2 text-base transition-all pr-6',
				'placeholder:text-neutral-600',
				'focus:placeholder:text-neutral-300 placeholder:transition-colors',
				'focus:outline-0'
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
			// onBlur={() => set_isFocused(false)}
		/>
	);
}
