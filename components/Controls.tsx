import {useDisperse} from './common/contexts/useDisperse';
import {DownloadTemplateButton} from './common/DownloadTemplateButton';
import {ExportConfigurationButton} from './common/ExportConfigurationButton';
import {IconPlus} from './common/icons/IconPlus';
import {ImportConfigurationButton} from './common/ImportConfigurationButton';
import {newDisperseVoidRow} from './disperse/useDisperse.helpers';

import type {ReactElement} from 'react';

export function Controls(): ReactElement | null {
	const {configuration, dispatchConfiguration} = useDisperse();
	if (configuration.inputs.length < 1) {
		return null;
	}

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
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
				<ImportConfigurationButton className={'!bg-primary !text-secondary'} />
				<ExportConfigurationButton />
				<DownloadTemplateButton />
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
