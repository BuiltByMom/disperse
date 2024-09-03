import {type ReactElement, useCallback, useEffect, useState} from 'react';
import Papa from 'papaparse';
import {cl, isAddress, toAddress} from '@builtbymom/web3/utils';

import {newDisperseVoidRow} from '../disperse/useDisperse.helpers';
import {UploadModal} from '../UploadModal';
import {IconImport} from './icons/IconImport';
import {errorFileUploadToast, succsessFileUploadToast} from './utils/toasts';

import type {TDisperseInput} from './types/disperse.types';
import type {TInputAddressLike} from './utils/tools.address';

import {useDisperse} from '@/components/common/contexts/useDisperse';
import {useValidateAmountInput} from '@/components/common/hooks/useValidateAmountInput';

type TImportConfigurationButtonProps = {
	className?: string;
	isUploadModalOpen: boolean;
	set_isUploadModalOpen: (value: boolean) => void;
};

export function ImportConfigurationButton({
	isUploadModalOpen,
	set_isUploadModalOpen,
	className
}: TImportConfigurationButtonProps): ReactElement {
	const onDrop = useCallback((acceptedFiles: Blob[]) => {
		set_files(acceptedFiles);
	}, []);

	const [files, set_files] = useState<Blob[] | undefined>(undefined);
	const {validate: validateAmount} = useValidateAmountInput();
	const {configuration, dispatchConfiguration} = useDisperse();
	const [isProcessingFile, set_isProcessingFile] = useState(false);

	useEffect(() => {
		if (!files) {
			return;
		}
		handleFileUpload(files);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);

	const handleFileUpload = (files: Blob[]): void => {
		if (!files) {
			return;
		}
		set_isProcessingFile(true);
		const [file] = files as unknown as Blob[];
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
				set_isUploadModalOpen(false);
				succsessFileUploadToast();
				set_isProcessingFile(false);
			} else {
				set_isUploadModalOpen(false);
				errorFileUploadToast();
				console.error('Invalid CSV file. Please make sure the file has two columns: receiverAddress and value');
				set_isProcessingFile(false);
			}
		};
		reader.readAsText(file);
	};

	return (
		<button
			className={cl(
				'relative flex cursor-pointer text-xs md:text-base items-center gap-2 rounded-lg bg-primary/10 p-2 font-bold text-primary',
				className
			)}
			onClick={() => {
				set_isUploadModalOpen(true);
			}}>
			<IconImport />
			{'Import configuration'}

			<UploadModal
				isProcessingFile={isProcessingFile}
				isOpen={isUploadModalOpen}
				onClose={() => set_isUploadModalOpen(false)}
				handleUpload={handleFileUpload}
				onDrop={onDrop}
			/>
		</button>
	);
}
