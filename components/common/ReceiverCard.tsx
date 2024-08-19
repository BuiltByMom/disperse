import {type ReactElement} from 'react';

import {useDisperse} from './contexts/useDisperse';
import {IconCross} from './icons/IconCross';
import {type TDisperseInput} from './types/disperse.types';

export function ReceiverCard({input}: {input: TDisperseInput}): ReactElement {
	const {dispatchConfiguration} = useDisperse();

	const onDeleteReceiver = (): void => {
		dispatchConfiguration({type: 'DEL_RECEIVER_BY_UUID', payload: input.UUID});
	};

	return (
		<div
			className={'relative col-span-1 w-full rounded-3xl bg-background-modal/90 p-4 md:!h-[152px] md:!w-[282px]'}>
			<button
				onClick={onDeleteReceiver}
				className={
					'absolute -right-[7px] -top-[7px] flex size-6 items-center justify-center rounded-full bg-primary'
				}>
				<IconCross className={'size-2'} />
			</button>
		</div>
	);
}
