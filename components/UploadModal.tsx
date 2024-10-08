import {type ReactElement, useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import Papa from 'papaparse';
import {cl} from '@builtbymom/web3/utils';

import {IconSpinner} from './common/icons/IconSpinner';
import {IconUpload} from './common/icons/IconUpload';
import {ModalWrapper} from './common/ModalWrapper';

type TUploadModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	description?: string | ReactElement;
	uploadInput?: ReactElement;
	handleUpload: (files: Blob[]) => void;
	onDrop?: (files: Blob[]) => void;
	isProcessingFile?: boolean;
};

export function UploadModal({
	isOpen,
	onClose,
	onDrop,
	handleUpload,
	isProcessingFile
}: TUploadModalProps): ReactElement {
	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true});

	const inputRef = useRef<HTMLInputElement | null>(null);

	/**********************************************************************************************
	 ** downloadTemplate function generates a CSV file from the receiverEntries array and triggers
	 ** a download of the file. It creates a Blob from the CSV string, generates a URL for the
	 ** Blob, and then creates an anchor element to download the file with a name based on the
	 ** current date.
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

	const getHint = (): ReactElement => {
		if (isProcessingFile) {
			return (
				<div className={'flex flex-col items-center justify-center gap-[20px]'}>
					<IconSpinner className={'animete-spin size-6'} />
					<span className={''}>{'File is processing...'}</span>
				</div>
			);
		}
		const handleButtonClick = (): void => {
			inputRef.current?.click();
		};

		if (isDragActive) {
			return <p>{'Drop it here!'}</p>;
		}

		return (
			<p>
				{'Drag and Drop your files here or '}
				<button
					onClick={handleButtonClick}
					className={'underline'}>
					<input
						{...getInputProps()}
						ref={inputRef}
						id={'file-upload'}
						tabIndex={-1}
						className={'absolute inset-0 !cursor-pointer opacity-0'}
						type={'file'}
						accept={'.csv'}
						onClick={event => event.stopPropagation()}
						onChange={e => handleUpload(e.target.files as unknown as Blob[])}
					/>
					{'browse'}
				</button>
			</p>
		);
	};

	return (
		<ModalWrapper
			isOpen={isOpen}
			className={'!h-[560px]'}
			onClose={onClose}>
			<div className={'mt-20 flex h-full flex-col justify-center'}>
				<div className={'mb-4 flex justify-center'}>
					<span className={'text-3xl font-bold text-primary'}>{'Upload File'}</span>
				</div>
				<div className={'flex gap-1 text-primary'}>
					<p>{'Upload a CSV with existing disperse receivers.'}</p>
					<button
						onClick={downloadTemplate}
						className={'underline'}>
						{'Download template'}
					</button>
				</div>

				<div
					{...getRootProps()}
					className={cl(
						'mt-10 relative flex size-full h-full flex-col justify-center',
						'rounded-lg border border-dashed border-primary/40 p-6',
						isDragActive && !isProcessingFile ? 'bg-primary/10' : ''
					)}>
					<div className={'flex flex-col gap-6'}>
						{!isProcessingFile && (
							<div className={'flex size-full justify-center '}>
								<IconUpload className={'size-6'} />
							</div>
						)}
						{getHint()}
					</div>
					{!isProcessingFile && !isDragActive && (
						<div className={'absolute bottom-4 left-1/2 -translate-x-1/2'}>
							<span className={'text-xs text-primary/40'}>{'.csv extension'}</span>
						</div>
					)}
				</div>
			</div>
		</ModalWrapper>
	);
}
