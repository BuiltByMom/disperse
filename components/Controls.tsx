import {useDisperse} from './common/contexts/useDisperse';
import {IconFile} from './common/icons/IconFile';
import {IconImport} from './common/icons/IconImport';
import {IconPlus} from './common/icons/IconPlus';
import {newDisperseVoidRow} from './disperse/useDisperse.helpers';

import type {ReactElement} from 'react';

export function Controls(): ReactElement | null {
	const {configuration, dispatchConfiguration} = useDisperse();
	if (configuration.inputs.length < 1) {
		return null;
	}

	const onAddReceivers = (amount: number): void => {
		dispatchConfiguration({
			type: 'ADD_RECEIVERS',
			payload: Array(amount)
				.fill(null)
				.map(() => newDisperseVoidRow())
		});
	};

	return (
		<div className={'mb-10 mt-[100px] flex w-full justify-between'}>
			<div className={'flex gap-2'}>
				<button className={'flex items-center gap-2 rounded-lg bg-primary p-2 font-bold text-secondary'}>
					<IconImport />
					{'Import configuration'}
				</button>
				<button className={'flex items-center gap-2 rounded-lg bg-primary p-2 font-bold text-secondary'}>
					<IconImport className={'rotate-180'} />
					{'Export configuration'}
				</button>
				<button className={'flex items-center gap-2 rounded-lg bg-primary/10 p-2 font-bold text-primary'}>
					<IconFile />
					{'Download template'}
				</button>
			</div>
			<div>
				<button
					onClick={() => onAddReceivers(1)}
					className={'flex items-center gap-2 rounded-lg bg-primary p-2 font-bold text-secondary'}>
					<IconPlus className={'size-4'} />
					{'Add receiver'}
				</button>
			</div>
		</div>
	);
}
