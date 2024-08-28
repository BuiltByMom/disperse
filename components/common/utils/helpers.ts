import {formatAmount, toAddress, zeroNormalizedBN} from '@builtbymom/web3/utils';

import type {TNormalizedBN} from '@builtbymom/web3/types';
import type {TDisperseInput} from '../types/disperse.types';
import type {TTokenAmountInputElement} from './utils';

/******************************************************************************
 ** Create a new empty TTokenAmountInputElement.
 *****************************************************************************/
export function getNewInput(): TTokenAmountInputElement {
	return {
		amount: '',
		normalizedBigAmount: zeroNormalizedBN,
		isValid: 'undetermined',
		token: undefined,
		status: 'none',
		UUID: crypto.randomUUID()
	};
}

export function handleLowAmount(normalizedBN: TNormalizedBN, min = 0, max = 6): string {
	const expected = formatAmount(normalizedBN.normalized, min, max);
	if (Number(expected) === 0) {
		return `< ${formatAmount(normalizedBN.normalized, max - 1, max - 1)}1`;
	}
	return expected;
}

export function findDuplicatedAddresses(inputs: TDisperseInput[]): Set<string> {
	const addressCount = new Map<string, number>();

	// Count occurrences of each address
	inputs.forEach(input => {
		if (!input.receiver.address) {
			return;
		}
		const addressKey = toAddress(input.receiver.address); // Adjust this based on how addresses are represented
		addressCount.set(addressKey, (addressCount.get(addressKey) || 0) + 1);
	});

	// Find addresses that are duplicated
	const duplicatedAddresses = new Set<string>();
	addressCount.forEach((count, address) => {
		if (count > 1) {
			duplicatedAddresses.add(address);
		}
	});

	return duplicatedAddresses;
}
