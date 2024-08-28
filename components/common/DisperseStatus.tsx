import {type ReactElement, useMemo, useState} from 'react';
import useWallet from '@builtbymom/web3/contexts/useWallet';
import {useAsyncTrigger} from '@builtbymom/web3/hooks/useAsyncTrigger';
import {isAddress, toAddress} from '@builtbymom/web3/utils';

import {Warning} from './Warning';
import {useDisperse} from './contexts/useDisperse';

import type {TAddress} from '@builtbymom/web3/types';
import type {TWarningType} from './types/types';

export function DisperseStatus(): ReactElement | null {
	const {configuration} = useDisperse();
	const {getBalance} = useWallet();

	const listDuplicates = useMemo(() => {
		// Check if two addresses are the same and list the duplicates
		const allDuplicates = configuration.inputs.reduce((acc, currentRow) => {
			const duplicates = configuration.inputs.reduce((acc, iteratedRow) => {
				if (
					isAddress(currentRow.receiver.address) &&
					isAddress(iteratedRow.receiver.address) &&
					currentRow.UUID !== iteratedRow.UUID &&
					currentRow.receiver.address === iteratedRow.receiver.address
				) {
					acc.push(toAddress(currentRow?.receiver?.address));
				}
				return acc;
			}, [] as TAddress[]);
			return acc.concat(duplicates);
		}, [] as TAddress[]);

		//Remove duplicates from the list
		const allDuplicatesSet = Array.from(new Set(allDuplicates));
		return allDuplicatesSet.length > 0 ? allDuplicatesSet.join(', ') : undefined;
	}, [configuration.inputs]);

	const [status, set_status] = useState<{type: TWarningType; message: string | ReactElement}[]>([]);

	const totalToDisperse = useMemo((): bigint => {
		return configuration.inputs.reduce((acc, row): bigint => acc + row.value.normalizedBigAmount.raw, 0n);
	}, [configuration.inputs]);

	const isAboveBalance =
		totalToDisperse >
		getBalance({
			address: toAddress(configuration.tokenToSend?.address),
			chainID: Number(configuration.tokenToSend?.chainID)
		}).raw;

	useAsyncTrigger(async (): Promise<void> => {
		const allStatus: {type: TWarningType; message: string | ReactElement}[] = [];

		if (listDuplicates) {
			allStatus.push({
				message: (
					<div className={'block items-center truncate whitespace-normal'}>
						{'Some duplicates were found in the configuration: '}
						<span className={'hidden items-center font-mono md:flex'}>{listDuplicates}</span>
						<span className={'md:hidden'}>{listDuplicates}</span>
					</div>
				),
				type: 'warning'
			});
		}
		if (isAboveBalance && configuration.tokenToSend) {
			allStatus.push({
				message: 'Total amount to disperse exceeds the account balance',
				type: 'error'
			});
		}

		set_status(allStatus);
	}, [configuration.tokenToSend, isAboveBalance, listDuplicates]);

	if (!status) {
		return null;
	}

	return (
		<div className={'flex flex-col gap-3'}>
			{status.map((status, index) => (
				<Warning
					key={index}
					message={status.message}
					type={status.type}
				/>
			))}
		</div>
	);
}
