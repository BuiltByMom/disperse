import {type ReactElement} from 'react';
import {cl} from '@builtbymom/web3/utils';

import {newDisperseVoidRow} from '../disperse/useDisperse.helpers';
import {useDisperse} from './contexts/useDisperse';
import {IconPlus} from './icons/IconPlus';

// type TAddReceiverCardProps = {};

export function AddReceiverCard({className}: {className?: string}): ReactElement {
	const {dispatchConfiguration} = useDisperse();

	const onAddReceivers = (amount: number): void => {
		dispatchConfiguration({
			type: 'ADD_RECEIVERS',
			payload: Array(amount)
				.fill(null)
				.map(() => newDisperseVoidRow())
		});
	};

	return (
		<button
			onClick={() => {
				onAddReceivers(1);
			}}
			className={cl(
				'flex h-[152px] w-[282px] flex-col items-center justify-center gap-2 rounded-3xl border border-accent bg-background-modal/90',
				className
			)}>
			<IconPlus className={'text-primary size-6'} />
			<span className={'text-primary text-base'}>{'Add receiver'}</span>
		</button>
	);
}
