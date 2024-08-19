import {type ReactElement, useState} from 'react';

import {AddressInput} from './AddressInput';
import {AmountInput} from './AmountInput';
import {useDisperse} from './contexts/useDisperse';
import {IconCross} from './icons/IconCross';
import {type TDisperseInput} from './types/disperse.types';
import {defaultInputAddressLike, type TInputAddressLike} from './utils/tools.address';

export function ReceiverCard({input}: {input: TDisperseInput}): ReactElement {
	const {dispatchConfiguration} = useDisperse();

	const [value, set_value] = useState<TInputAddressLike>(defaultInputAddressLike);

	const onDeleteReceiver = (): void => {
		dispatchConfiguration({type: 'DEL_RECEIVER_BY_UUID', payload: input.UUID});
	};

	return ( 
		<div className={'bg-background-modal/90 relative col-span-1 w-full rounded-3xl p-4 md:!w-[282px]'}>
			<button
				onClick={onDeleteReceiver}
				// eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
				className={
					'bg-primary absolute -right-[7px] -top-[7px] flex size-6 items-center justify-center rounded-full'
				}> 
				<IconCross className={'size-2'} />
			</button>
			<div className={'flex h-full flex-col gap-2'}>
				<AddressInput
					value={value}
					onSetValue={(input: Partial<TInputAddressLike>) => {
						set_value({...defaultInputAddressLike, label: input.label ?? ''});
					}}
				/>
				<AmountInput />
			</div>
		</div>
	);
}
