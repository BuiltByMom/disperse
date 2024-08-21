import {type ReactElement,useRef} from 'react';

import {AddressInput} from './AddressInput';
import {AmountInput} from './AmountInput';
import {useDisperse} from './contexts/useDisperse';
import {IconCross} from './icons/IconCross';
import {type TInputAddressLike} from './utils/tools.address';

import type {TAmountInputElement,TDisperseInput} from './types/disperse.types';
 
export function ReceiverCard({input}: {input: TDisperseInput}): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);
	const {configuration, dispatchConfiguration} = useDisperse();

	const onSetAmount = (value: Partial<TAmountInputElement>): void => {
		dispatchConfiguration({type: 'SET_VALUE', payload: {...value, UUID: input.UUID}}); 
	};

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const onDeleteReceiver = (): void => {
		dispatchConfiguration({type: 'DEL_RECEIVER_BY_UUID', payload: input.UUID});
	};

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const onSetReceiver = (value: Partial<TInputAddressLike>): void => {
		dispatchConfiguration({type: 'SET_RECEIVER', payload: {...value, UUID: input.UUID}});
	};

	return ( 
		<div className={'relative col-span-1 w-full rounded-3xl bg-background-modal/90 p-4 md:!w-[282px]'}>
			<button
				onClick={onDeleteReceiver}
				// eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
				className={
					'absolute -right-[7px] -top-[7px] flex size-6 items-center justify-center rounded-full bg-primary'
				}> 
				<IconCross className={'size-2'} />
			</button>
			<div className={'flex h-full flex-col gap-2'}>
				<AddressInput
					value={input.receiver}
					onSetValue={onSetReceiver}
					inputRef={inputRef}
				/>
				<AmountInput 
				onSetValue={onSetAmount}
				value={input.value}
				token={configuration.tokenToSend}
				/>
			</div>
		</div>
	);
}
