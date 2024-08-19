import {type ReactElement} from 'react';
import React from 'react';
import InputNumber from 'rc-input-number';
import {cl} from '@builtbymom/web3/utils'; 

import {useDisperse} from './contexts/useDisperse';
 
export function AmountInput(): ReactElement {
	const {configuration} = useDisperse();
	return (
		<label className={'border-primary/10 h-14 rounded-2xl border px-4 py-2'}>
			<InputNumber
				// ref={inputRef}
				prefixCls={cl(
					'w-full -mb-[3px] !bg-transparent text-base transition-all',
					'text-primary placeholder:text-primary/40 active:outline-0',
					'focus:placeholder:text-neutral-300 placeholder:transition-colors',
					'focus:border-primary/10 focus:outline-0',

					'placeholder:transition-colors overflow-hidden'
				)}
				min={'0'}
				step={0.1}
				decimalSeparator={'.'}
				placeholder={'0.00'}
				autoComplete={'off'}
				autoCorrect={'off'}
				spellCheck={'false'}
				// onBlur={() => set_isFocused(false)}
			/>
			{!configuration.tokenToSend && <span className={'text-primary/40 text-xs'}>{'Token not selected'}</span>}
		</label>
	);
}
