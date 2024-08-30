import {type ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import Papa from 'papaparse';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {useBalances} from '@builtbymom/web3/hooks/useBalances.multichains';
import {cl, toAddress, toNormalizedBN} from '@builtbymom/web3/utils';

import {UploadModal} from '../UploadModal';
import {useValidateAddressInput} from './hooks/useValidateAddressInput';
import {IconImport} from './icons/IconImport';

import type {TAddress, TToken} from '@builtbymom/web3/types';
import type {TDisperseInput} from './types/disperse.types';

import {newVoidRow, useDisperse} from '@/components/common/contexts/useDisperse';
import {useValidateAmountInput} from '@/components/common/hooks/useValidateAmountInput';

type TRecord = {
	tokenAddress: TAddress;
	receiverAddress: TAddress;
	value: string;
	chainId: string;
};

type TImportConfigurationButtonProps = {
	className?: string;
};

export function ImportConfigurationButton({className}: TImportConfigurationButtonProps): ReactElement {
	const {dispatchConfiguration} = useDisperse();
	const {chainID: safeChainID} = useWeb3();
	const {validate: validateAddress} = useValidateAddressInput();
	const {validate: validateAmount} = useValidateAmountInput();

	const [importedTokenToSend, set_importedTokenToSend] = useState<string | undefined>(undefined);
	const [records, set_records] = useState<TRecord[] | undefined>(undefined);
	const [isOpen, set_isOpen] = useState(false);

	const [files, set_files] = useState<Blob[] | undefined>(undefined);

	const onSelectToken = (token: TToken | undefined): void => {
		dispatchConfiguration({type: 'SET_TOKEN_TO_SEND', payload: token});
	};

	const onDrop = useCallback((acceptedFiles: Blob[]) => {
		set_files(acceptedFiles);
	}, []);

	/** Token in URL may not be present in csv file, so better to be fetched  */
	const {data: initialTokenRaw} = useBalances({
		tokens: [{address: toAddress(importedTokenToSend), chainID: safeChainID}]
	});

	useEffect(() => {
		if (!files) {
			return;
		}
		handleFileUpload(files);
	}, [files]);

	const initialToken = useMemo((): TToken | undefined => {
		return initialTokenRaw[safeChainID] && importedTokenToSend
			? initialTokenRaw[safeChainID][importedTokenToSend]
			: undefined;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialTokenRaw]);

	const getInitialAmount = (amount: string, token: TToken | undefined): string => {
		amount = amount.toLocaleLowerCase();
		if (amount.includes('1e+')) {
			const scientificString = amount.replace('1e+', '1e');
			const bigIntValue = BigInt(parseFloat(scientificString).toFixed(0));
			amount = bigIntValue.toString();
		}
		return amount && token ? toNormalizedBN(amount, token.decimals).display : '0';
	};

	const onAddInputs = (inputs: TDisperseInput[]): void => {
		dispatchConfiguration({type: 'ADD_RECEIVERS', payload: inputs});
	};

	const clearReceivers = (): void => {
		dispatchConfiguration({type: 'CLEAR_RECEIVERS', payload: undefined});
	};

	const handleFileUpload = (files: Blob[]): void => {
		if (!files) {
			return;
		}
		const [file] = files as unknown as Blob[];
		const reader = new FileReader();
		reader.onload = event => {
			if (!event?.target?.result) {
				return;
			}
			const {result} = event.target;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const parsedCSV = Papa.parse(result as any, {header: true}) as any;
			const records: TRecord[] = [];

			// If we are working with a safe file, we should get 4 columns.
			const isProbablySafeFile =
				parsedCSV.meta.fields.length === 4 && parsedCSV.meta.fields[0] === 'tokenAddress';

			if (isProbablySafeFile) {
				const [tokenAddress, chainId, receiverAddress, value] = parsedCSV.meta.fields;
				for (const item of parsedCSV.data) {
					if (!item[receiverAddress]) {
						continue;
					}
					records.push({
						tokenAddress: item[tokenAddress] as TAddress,
						receiverAddress: item[receiverAddress] as TAddress,
						value: item[value] as string,
						chainId: item[chainId] as string
					});
				}
				// records = records.filter(record => record.receiverAddress);
				set_importedTokenToSend(records[0].tokenAddress);
				set_records(records);
			} else {
				console.error('The file you are trying to upload seems to be broken');
			}
		};
		reader.readAsBinaryString(file);

		set_isOpen(false);
	};

	/** Set imported token from url if present */
	useEffect(() => {
		if (initialToken) {
			onSelectToken(initialToken);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialToken]);

	useEffect(() => {
		if (!records || !Array.isArray(records)) {
			return;
		}

		const resultInputs: TDisperseInput[] = [];
		const promises = records.map(async record => validateAddress(undefined, record.receiverAddress));
		Promise.all(promises)
			.then(values => {
				values.forEach((validatedReceiver, index) => {
					const stringAmount = getInitialAmount(records[index].value, initialToken);
					const value = {
						receiver: validatedReceiver,
						value: {...newVoidRow().value, ...validateAmount(stringAmount, initialToken)},
						UUID: crypto.randomUUID()
					};
					resultInputs.push(value);
				});
			})
			.finally(() => {
				clearReceivers();
				onAddInputs(resultInputs);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialToken]);

	return (
		<button
			className={cl(
				'relative flex cursor-pointer text-xs md:text-base items-center gap-2 rounded-lg bg-primary/10 p-2 font-bold text-primary',
				className
			)}
			onClick={() => {
				set_isOpen(true);
				// document.querySelector<HTMLInputElement>('#file-upload')?.click();
			}}>
			<IconImport />
			{'Import configuration'}

			<UploadModal
				isOpen={isOpen}
				onClose={() => set_isOpen(false)}
				onBrowse={() => document.querySelector<HTMLInputElement>('#file-upload')?.click()}
				handleUpload={handleFileUpload}
				onDrop={onDrop}
			/>
		</button>
	);
}
