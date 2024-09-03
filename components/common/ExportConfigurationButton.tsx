import {type ReactElement, useCallback} from 'react';
import Papa from 'papaparse';
import {cl} from '@builtbymom/web3/utils';

import {useDisperse} from './contexts/useDisperse';
import {IconImport} from './icons/IconImport';

export function ExportConfigurationButton({className}: {className?: string}): ReactElement {
	const {configuration} = useDisperse();

	/**********************************************************************************************
	 ** downloadConfiguration function generates a CSV file from the configuration inputs and
	 ** triggers a download of the file. It maps over the inputs to extract receiver addresses and
	 ** values, filters out any invalid entries, and then creates a Blob from the CSV string.
	 ** Finally, it generates a URL for the Blob and creates an anchor element to download the file
	 ** with a name based on the current date.
	 *********************************************************************************************/
	const downloadConfiguration = useCallback(async () => {
		const receiverEntries = configuration.inputs
			.map(input => ({
				receiverAddress: input.receiver.address,
				value: input.value.normalizedBigAmount.normalized.toString()
			}))
			.filter(entry => entry.value && entry.receiverAddress);

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
	}, [configuration.inputs]);

	return (
		<button
			onClick={downloadConfiguration}
			className={cl(
				'flex text-xs md:text-base items-center gap-2 rounded-lg bg-primary p-2 font-bold text-secondary',
				className
			)}>
			<IconImport className={'rotate-180'} />
			{'Export configuration'}
		</button>
	);
}
