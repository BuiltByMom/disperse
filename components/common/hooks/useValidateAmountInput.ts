import {useCallback, useState} from 'react';
import {fromNormalized, toBigInt, toNormalizedBN, zeroNormalizedBN} from '@builtbymom/web3/utils';

import {getNewInput} from '../utils/helpers'; 
import {type TTokenAmountInputElement} from '../utils/utils';

import type {TNormalizedBN, TToken} from '@builtbymom/web3/types';

export const defaultTokenInputLike: TTokenAmountInputElement = getNewInput();

export function useValidateAmountInput(): {
	validate: (
		inputValue: string | undefined,
		token: TToken | undefined,
		inputRaw?: TNormalizedBN
	) => Partial<TTokenAmountInputElement>;
	result: Partial<TTokenAmountInputElement> | undefined;
} {
	const [result, set_result] = useState<Partial<TTokenAmountInputElement> | undefined>(undefined);

	/**********************************************************************************************
	 ** validate function is a memoized callback that validates the input amount for a token.
	 ** It handles various scenarios:
	 ** 1. No input value or raw input
	 ** 2. Raw input greater than zero
	 ** 3. String input value greater than zero
	 ** 4. Invalid input
	 ** 
	 ** For each scenario, it checks:
	 ** - If a token is selected
	 ** - If the input amount exceeds the token balance
	 ** 
	 ** It returns an object with:
	 ** - amount: The display value of the input
	 ** - normalizedBigAmount: The input amount as a normalized BigInt
	 ** - isValid: Whether the input is valid
	 ** - token: The token object
	 ** - error: Any error message, if applicable
	 ** 
	 ** The function also updates the component's state with the result.
	 *********************************************************************************************/
	const validate = useCallback(
		(
			inputValue: string | undefined,
			token: TToken | undefined,
			inputRaw?: TNormalizedBN
		): Partial<TTokenAmountInputElement> => {
			if (!inputValue && !inputRaw) {
				const result = {
					amount: inputValue,
					normalizedBigAmount: zeroNormalizedBN,
					isValid: true,
					token,
					error: 'The amount is invalid'
				};
				set_result(result); 
				return result;
			}

			if (inputRaw && inputRaw.raw > 0n) {
				if (!token?.address) {
					const result = {
						amount: inputRaw.display,
						normalizedBigAmount: inputRaw,
						isValid: false,
						token,
						error: 'No token selected'
					};
					set_result(result);
					return result;
				}
				if (inputRaw.raw > token.balance.raw) {
					const result = {
						amount: inputRaw.display,
						normalizedBigAmount: inputRaw,
						isValid: false,
						token,
						error: 'Insufficient Balance'
					};
					set_result(result);
					return result;
				}
				const result = {
					amount: inputRaw.display,
					normalizedBigAmount: inputRaw,
					isValid: true,
					token,
					error: undefined
				};
				set_result(result);
				return result;
			}
			if (inputValue && +inputValue > 0) {
				const inputBigInt = inputValue ? fromNormalized(inputValue, token?.decimals || 18) : toBigInt(0);
				const asNormalizedBN = toNormalizedBN(inputBigInt, token?.decimals || 18);

				if (!token?.address) {
					const result = {
						amount: asNormalizedBN.display,
						normalizedBigAmount: asNormalizedBN,
						isValid: false,
						token,
						error: 'No token selected'
					};
					set_result(result);
					return result;
				}

				if (inputBigInt > token.balance.raw) {
					const result = {
						amount: asNormalizedBN.display,
						normalizedBigAmount: asNormalizedBN,
						isValid: false,
						token,
						error: 'Insufficient Balance'
					};
					set_result(result);
					return result;
				}
				const result = {
					amount: asNormalizedBN.display,
					normalizedBigAmount: asNormalizedBN,
					isValid: true,
					token,
					error: undefined
				};
				set_result(result);
				return result;
			}

			const result = {
				amount: '0',
				normalizedBigAmount: zeroNormalizedBN,
				isValid: false,
				token,
				error: 'The amount is invalid'
			};
			set_result(result);
			return result;
		},
		[]
	);

	return {validate, result};
}
