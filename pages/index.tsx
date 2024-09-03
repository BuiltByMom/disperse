import {type ReactElement, useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Toaster} from 'react-hot-toast';
import Papa from 'papaparse';
import {cl, isAddress, toAddress} from '@builtbymom/web3/utils';

import type {TDisperseInput} from '@/components/common/types/disperse.types';
import type {TInputAddressLike} from '@/components/common/utils/tools.address';

import {ActionSection} from '@/components/ActionSection';
import {useDisperse} from '@/components/common/contexts/useDisperse';
import {useValidateAmountInput} from '@/components/common/hooks/useValidateAmountInput';
import {IconSpinner} from '@/components/common/icons/IconSpinner';
import {IconUpload} from '@/components/common/icons/IconUpload';
import {Receivers} from '@/components/common/Receivers';
import {errorFileUploadToast, succsessFileUploadToast} from '@/components/common/utils/toasts';
import {Controls} from '@/components/Controls';
import {newDisperseVoidRow} from '@/components/disperse/useDisperse.helpers';
import {HeaderSection} from '@/components/HeaderSection';

export default function Home(): ReactElement {
	const onDrop = useCallback((acceptedFiles: Blob[]) => {
		set_files(acceptedFiles);
	}, []);
	const {getRootProps, isDragActive} = useDropzone({
		onDrop,
		noClick: true,
		noKeyboard: true,
		maxFiles: 1
	});
	const [files, set_files] = useState<Blob[] | undefined>(undefined);
	const [isUploadModalOpen, set_isUploadModalOpen] = useState(false);
	const {validate: validateAmount} = useValidateAmountInput();
	const {configuration, dispatchConfiguration} = useDisperse();
	const [isProcessingFile, set_isProcessingFile] = useState(false);

	useEffect(() => {
		if (!files) {
			return;
		}
		!isUploadModalOpen && handleFileUpload(files);
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
				const records: TDisperseInput[] = parsedCSV.data.reduce((acc: TDisperseInput[], row: never) => {
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
				succsessFileUploadToast();
				set_isProcessingFile(false);
			} else {
				set_isProcessingFile(false);
				errorFileUploadToast();
				console.error('Invalid CSV file. Please make sure the file has two columns: receiverAddress and value');
			}
		};
		reader.readAsText(file);
	};

	return (
		<div
			{...getRootProps()}
			className={'relative flex min-h-screen flex-col items-center justify-start bg-background pt-6 md:py-6'}>
			<div
				className={cl(
					'fixed inset-0 flex h-screen items-center justify-center z-40',
					(isDragActive && !isUploadModalOpen) || isProcessingFile
						? 'bg-secondary/5 backdrop-blur-lg transition-opacity'
						: 'pointer-events-none'
				)}>
				{(isDragActive && !isUploadModalOpen) || isProcessingFile ? (
					<div className={'absolute flex h-min flex-col items-center justify-center gap-[14px]'}>
						{!isProcessingFile ? (
							<>
								<IconUpload className={'size-14'} />
								<p className={'text-[40px] leading-[48px]'}>{'Drop it here!'}</p>
								<p>{'Upload file by dropping it in this window'}</p>
							</>
						) : (
							<div className={'flex size-full flex-col items-center justify-center gap-2'}>
								<IconSpinner className={'animate-spin text-primary'} />
								<span className={'text-[40px] leading-[48px]'}>{'File is processing...'}</span>
							</div>
						)}
					</div>
				) : null}
			</div>
			<HeaderSection />
			<div className={'w-full md:max-w-[1200px] md:px-6'}>
				<Controls
					isUploadModalOpen={isUploadModalOpen}
					set_isUploadModalOpen={set_isUploadModalOpen}
				/>
				<Receivers
					isUploadModalOpen={isUploadModalOpen}
					set_isUploadModalOpen={set_isUploadModalOpen}
				/>
				<ActionSection />
			</div>
			<Toaster position={'bottom-right'} />
		</div>
	);
}
