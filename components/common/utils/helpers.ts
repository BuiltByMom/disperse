import {formatAmount, toAddress, zeroNormalizedBN} from '@builtbymom/web3/utils';

import type {TNormalizedBN} from '@builtbymom/web3/types';
import type {TDisperseInput} from '../types/disperse.types';
import type {TTokenAmountInputElement} from './utils';

/******************************************************************************
 ** Creates a new empty TTokenAmountInputElement.
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

/**************************************************************************************************
** handleLowAmount function formats a normalized amount, handling cases where the amount is very low.
** If the formatted amount is zero, it returns a string indicating the amount is less than the
** smallest representable value. Otherwise, it returns the formatted amount as a string.
**************************************************************************************************/
export function handleLowAmount(normalizedBN: TNormalizedBN, min = 0, max = 6): string {
	const expected = formatAmount(normalizedBN.normalized, min, max);
	if (Number(expected) === 0) {
		return `< ${formatAmount(normalizedBN.normalized, max - 1, max - 1)}1`;
	}
	return expected;
}

/**************************************************************************************************
 ** Finds and returns a Set of duplicated addresses from the input array.
 ** - An array of TDisperseInput objects containing receiver addresses. A Set of string addresses
 ** that appear more than once in the input.
 ** This function iterates through the input array, counting occurrences of each address. It then 
 ** identifies and returns addresses that appear multiple times. Addresses are normalized using 
 ** the toAddress function before comparison.
 *************************************************************************************************/
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
