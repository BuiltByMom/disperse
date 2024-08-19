import {zeroNormalizedBN} from '@builtbymom/web3/utils';

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

