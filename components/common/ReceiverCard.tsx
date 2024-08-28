import {type ReactElement, useRef} from 'react';
import {cl} from '@builtbymom/web3/utils';

import {AddressInput} from './AddressInput';
import {AmountInput} from './AmountInput';
import {useDisperse} from './contexts/useDisperse';
import {IconCross} from './icons/IconCross';
import {type TInputAddressLike} from './utils/tools.address';

import type {TAmountInputElement, TDisperseInput} from './types/disperse.types';

type TReceiverCardProps = {
	input: TDisperseInput;
	isDuplicated?: boolean;
};

export function ReceiverCard({input, isDuplicated}: TReceiverCardProps): ReactElement {
	const inputRef = useRef<HTMLInputElement>(null);
	const {configuration, dispatchConfiguration} = useDisperse();

	/**********************************************************************************************
	 ** onSetAmount function updates the amount-related data in the configuration state.
	 ** It dispatches an action of type 'SET_VALUE' with a payload that combines the given 'value'
	 ** object(containing partial amount details) with the existing UUID of the input element.
	 *********************************************************************************************/
	const onSetAmount = (value: Partial<TAmountInputElement>): void => {
		dispatchConfiguration({type: 'SET_VALUE', payload: {...value, UUID: input.UUID}});
	};

	/**********************************************************************************************
	 ** onDeleteReceiver function, dispatches an action to delete a receiver from the configuration
	 ** state. The action type is 'DEL_RECEIVER_BY_UUID' and the payload contains the UUID of the
	 ** receiver to be deleted.
	 *********************************************************************************************/
	const onDeleteReceiver = (): void => {
		dispatchConfiguration({type: 'DEL_RECEIVER_BY_UUID', payload: input.UUID});
	};

	/**********************************************************************************************
	 ** onSetReceiver function updates the configuration state by dispatching an action of type
	 ** 'SET_RECEIVER'. It takes an object 'value' containing partial receiver details and merges
	 ** it with the existing UUID of the receiver. The updated receiver data is then sent as the
	 ** payload of the dispatched action.
	 *********************************************************************************************/
	const onSetReceiver = (value: Partial<TInputAddressLike>): void => {
		dispatchConfiguration({type: 'SET_RECEIVER', payload: {...value, UUID: input.UUID}});
	};

	return (
		<div
			className={cl(
				'relative col-span-1 w-full rounded-3xl bg-background-modal/90 p-4',
				isDuplicated ? 'border-warning border' : ''
			)}>
			<button
				onClick={onDeleteReceiver}
				className={
					'absolute right-[-7px] top-[-7px] flex size-6 items-center justify-center rounded-full bg-primary hover:bg-primary/90'
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
