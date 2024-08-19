import {useDisperse} from './common/contexts/useDisperse';
import {IconFile} from './common/icons/IconFile';
import {IconImport} from './common/icons/IconImport';
import {IconPlus} from './common/icons/IconPlus';

import type {ReactElement} from 'react';

export function Controls(): ReactElement | null {
	const {configuration} = useDisperse();
	if (configuration.inputs.length < 1) {
		return null;
	}
	return (
		<div className={'mb-10 mt-[100px] flex w-full max-w-[1200px] justify-between'}>
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
				<button className={'flex items-center gap-2 rounded-lg bg-primary p-2 font-bold text-secondary'}>
					<IconPlus className={'size-4'} />
					{'Add receiver'}
				</button>
			</div>
		</div>
	);
}
