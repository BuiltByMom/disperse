import {formatAmount, zeroNormalizedBN} from '@builtbymom/web3/utils';

import type {TNormalizedBN} from '@builtbymom/web3/types';
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
