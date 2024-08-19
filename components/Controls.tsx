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
				<button className={'bg-primary text-secondary flex items-center gap-2 rounded-lg p-2 font-bold'}>
					<IconImport />
					{'Import configuration'}
				</button>
				<button className={'bg-primary text-secondary flex items-center gap-2 rounded-lg p-2 font-bold'}>
					<IconImport className={'rotate-180'} />
					{'Export configuration'}
				</button>
				<button className={'bg-primary/10 text-primary flex items-center gap-2 rounded-lg p-2 font-bold'}>
					<IconFile />
					{'Download template'}
				</button>
			</div>
			<div>
				<button
					onClick={() => onAddReceivers(1)}
					className={'bg-primary text-secondary flex items-center gap-2 rounded-lg p-2 font-bold'}>
					<IconPlus className={'size-4'} />
					{'Add receiver'}
				</button>
			</div>
		</div>
	);
}
