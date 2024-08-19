
import type {TNormalizedBN, TToken} from '@builtbymom/web3/types';

export type TModify<TOriginal, TModification> = Omit<TOriginal, keyof TModification> & TModification;

/**************************************************************************************************
 ** Acts like Partial, but requires all properties to be explicity set to undefined if missing.
 *************************************************************************************************/
export type TPartialExhaustive<T> = {[Key in keyof T]: T[Key] | undefined};

/**************************************************************************************************
 ** The TTokenAmountInputElement type definition is used in the SmolTokenAmountInput component
 ** and define the different properties that are used to represent a token amount input element.
 ** The properties are:
 ** - amount: string - Represents what the user inputed
 ** - value?: number - Represents the value of the input element
 ** - normalizedBigAmount: TNormalizedBN - Represents the normalized amount, used for calculations
 ** - token: TToken | undefined - Represents the token that the user selected
 ** - status: 'pending' | 'success' | 'error' | 'none' - Represents the status of the input element
 ** - isValid: boolean | 'undetermined' - Represents if the input is valid
 ** - error?: string | undefined - Represents the error message if the input is invalid
 ** - UUID: string - Represents the unique identifier of the input element
 *************************************************************************************************/
export type TTokenAmountInputElement = {
	amount: string;
	value?: number;
	normalizedBigAmount: TNormalizedBN;
	token: TToken | undefined;
	status: 'pending' | 'success' | 'error' | 'none';
	isValid: boolean | 'undetermined';
	error?: string | undefined;
	UUID: string;
};

export function isNonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/**
 * Strips the query params from a URL if present
 */
export function getPathWithoutQueryParams(path: string): string {
	const pathParts = path.split('?');
	return pathParts[0];
}

/**
 * Converts a state object into a query params string that can be used in an URL.
 *
 * It is a generic helper.
 */
export function serializeSearchStateForUrl(state: {[key: string]: unknown}): string {
	const mappedStateEntries = Object.entries(state).map(([key, value]) => {
		if (!value) {
			return undefined;
		}

		if (Array.isArray(value)) {
			if (value.length === 0) {
				return undefined;
			}
			if (!['string', 'number', 'bigint', 'boolean'].includes(typeof value[0])) {
				return undefined;
			}
			return `${key}=${value.join(',')}`;
		}

		return `${key}=${value}`;
	});

	const filteredStateEntries = mappedStateEntries.filter(isNonNullable);

	return encodeURI(filteredStateEntries.join('&'));
}
