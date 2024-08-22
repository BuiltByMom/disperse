import Papa from 'papaparse';
import {cl, isAddress, toAddress} from '@builtbymom/web3/utils';

import {IconImport} from './icons/IconImport';

import type {ChangeEvent, ReactElement} from 'react';
import type {TDisperseInput} from '@/components/common/types/disperse.types';
import type {TInputAddressLike} from '@/components/common/utils/tools.address';

import {useDisperse} from '@/components/common/contexts/useDisperse';
import {useValidateAmountInput} from '@/components/common/hooks/useValidateAmountInput';
import {newDisperseVoidRow} from '@/components/disperse/useDisperse.helpers';

export function ImportConfigurationButton({className}: {className?: string}): ReactElement {
	const {configuration, dispatchConfiguration} = useDisperse();
	const {validate: validateAmount} = useValidateAmountInput();

    /**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
		if (!e.target.files) {
			return;
		}
		const [file] = e.target.files as unknown as Blob[];
		const reader = new FileReader();
		reader.onload = event => {
			if (!event?.target?.result) {
				return;
			}
			const {result} = event.target;

			/**************************************************************************************
			 ** Parse the CSV file using Papa Parse
			 *************************************************************************************/
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const parsedCSV: any = Papa.parse(result as string, {
				header: true,
				skipEmptyLines: true
			});

          
			/**************************************************************************************
			 ** Check if the file is valid
			 *************************************************************************************/
			const isValidFile =
				parsedCSV.data.length > 0 &&
				parsedCSV.meta.fields &&
				parsedCSV.meta.fields.length === 2 &&
				parsedCSV.meta.fields.includes('receiverAddress') &&
				parsedCSV.meta.fields.includes('value');
 
			if (isValidFile) {
				/**************************************************************************************
				 ** Extract field names
				 *************************************************************************************/
				const [receiverAddress, value] = parsedCSV.meta.fields;

				/**************************************************************************************
				 ** Process each row to create records
				 *************************************************************************************/
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const records: TDisperseInput[] = parsedCSV.data.reduce((acc: TDisperseInput[], row: any) => {
					const address = toAddress(row[receiverAddress]);
					const amount = row[value];

					/**************************************************************************************
					 ** Validate address and amount
					 *************************************************************************************/
					if (isAddress(address) && amount) {
						const parsedAmount = parseFloat(amount).toString();

						const record: TDisperseInput = {
							receiver: {
								address: toAddress(address),
								label: toAddress(address)
							} as TInputAddressLike,
							value: {
								...newDisperseVoidRow().value,
								...validateAmount(parsedAmount, configuration.tokenToSend)
							},
							UUID: crypto.randomUUID()
						};

						acc.push(record);
					}
					return acc;
				}, []);

				/**************************************************************************************
				 ** Update the state with the new records
				 *************************************************************************************/
				dispatchConfiguration({type: 'PASTE_RECEIVERS', payload: records});
			} else {
				console.error('The file you are trying to upload seems to be broken');
			}
		};
		reader.readAsText(file);
	};
	return (
		<button
			className={
				cl('relative flex cursor-pointer text-xs md:text-base items-center gap-2 rounded-lg bg-primary/10 p-2 font-bold text-primary', className)
			}
			onClick={() => {
				document.querySelector<HTMLInputElement>('#file-upload')?.click();
			}}>
			<input
				id={'file-upload'}
				tabIndex={-1}
				className={'absolute inset-0 size-1 cursor-pointer opacity-0'}
				type={'file'}
				accept={'.csv'}
				onClick={event => event.stopPropagation()}
				onChange={handleFileUpload}
			/>
			<IconImport />
			{'Import configuration'}
		</button>
	);
}
