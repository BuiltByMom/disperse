import Papa from 'papaparse';
import {cl} from '@builtbymom/web3/utils';

import {IconFile} from './icons/IconFile';

import type {ReactElement} from 'react';

export function DownloadTemplateButton({className}: {className?: string}): ReactElement {
	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const downloadTemplate = async (): Promise<void> => {
		const receiverEntries = [{receiverAddress: '0x10001192576E8079f12d6695b0948C2F41320040', value: '4.20'}];

		const csv = Papa.unparse(receiverEntries, {header: true});
		const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		const name = `disperse-${new Date().toISOString().split('T')[0]}.csv`;
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', name);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	return (
		<button
			onClick={downloadTemplate}
			className={cl(
				'flex text-xs md:text-base items-center gap-2 rounded-lg bg-primary/10 p-2 font-bold text-primary',
				className
			)}>
			<IconFile />
			{'Download template'}
		</button>
	);
}
