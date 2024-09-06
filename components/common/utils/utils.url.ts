
import {isString} from './utils';

import type {ParsedUrlQuery} from 'querystring';

type TGetParamFromUrlQuery<TDefault, TResult> = (key: string, defaultValue?: TDefault) => TResult;

type TGetStringParamFromUrlQuery = TGetParamFromUrlQuery<string | undefined, string | undefined>;

/**********************************************************************************************
 ** getStringParamFromUrlQuery function returns a function that extracts a string parameter
 ** from a URL query.
 ** 
 ** This function is useful for safely extracting string parameters from URL queries, providing
 ** a default value if the parameter is not present or is an empty string.
 *********************************************************************************************/
export function getStringParamFromUrlQuery(query: ParsedUrlQuery): TGetStringParamFromUrlQuery {
	return (key: string, defaultValue?: string) => {
		const param = query[key];
		if (isString(param) && param.length > 0) {
			return param;
		} 
		return defaultValue;
	};
}

type TGetNumberParamFromUrlQuery = TGetParamFromUrlQuery<number | undefined, number | undefined>;

/**********************************************************************************************
 ** getNumberParamFromUrlQuery function returns a function that extracts a number parameter
 ** from a URL query.
 ** 
 ** This function is useful for safely extracting number parameters from URL queries, providing
 ** a default value if the parameter is not present or cannot be converted to a valid number.
 ** 
 ** It attempts to parse the parameter as a number, and returns the parsed number if successful,
 ** or the default value if parsing fails or the parameter is not present.
 *********************************************************************************************/
export function getNumberParamFromUrlQuery(query: ParsedUrlQuery): TGetNumberParamFromUrlQuery {
	return (key: string, defaultValue?: number) => {
		const param = query[key];
		if (isString(param)) {
			const number = Number(param);
			if (!Number.isNaN(number)) {
				return number;
			}
		}
		return defaultValue;
	};
}

type TGetArrayParamFromUrlQuery = TGetParamFromUrlQuery<[] | undefined, string[] | undefined>;

/**********************************************************************************************
 ** getArrayParamFromUrlQuery function returns a function that extracts an array parameter
 ** from a URL query.
 ** 
 ** This function is useful for safely extracting array parameters from URL queries, providing
 ** a default value if the parameter is not present or is not in the expected format.
 ** 
 ** It handles three cases:
 ** 1. If the parameter is already an array, it returns it as-is.
 ** 2. If the parameter is a string, it splits it by commas to create an array.
 ** 3. If the parameter is neither an array nor a string, it returns the default value.
 ** 
 ** This allows for flexible parsing of array-like parameters in URL queries, supporting both
 ** multi-value query parameters and comma-separated string representations of arrays.
 *********************************************************************************************/
export function getArrayParamFromUrlQuery(query: ParsedUrlQuery): TGetArrayParamFromUrlQuery {
	return (key: string, defaultValue?: []) => {
		const param = query[key];
		if (Array.isArray(param)) {
			return param;
		}
		if (isString(param)) {
			return param.split(',');
		}
		return defaultValue;
	};
}

/**********************************************************************************************
 ** getParamFromUrlQuery function returns an object with methods to extract different types of
 ** parameters from a URL query.
 ** 
 ** This function combines the functionality of getStringParamFromUrlQuery, 
 ** getNumberParamFromUrlQuery, and getArrayParamFromUrlQuery into a single object.
 ** 
 ** It provides a convenient way to access all three parameter extraction methods at once,
 ** allowing for flexible and type-specific parsing of URL query parameters.
 *********************************************************************************************/
export function getParamFromUrlQuery(query: ParsedUrlQuery): {
	string: TGetStringParamFromUrlQuery;
	number: TGetNumberParamFromUrlQuery;
	array: TGetArrayParamFromUrlQuery;
} {
	return {
		string: getStringParamFromUrlQuery(query),
		array: getArrayParamFromUrlQuery(query),
		number: getNumberParamFromUrlQuery(query)
	};
}

/**
 * Uses the `getParamFromUrl` helpers to get state value from URL query params based on a state schema.
 *
 */
export function getStateFromUrlQuery<TState>(
	query: ParsedUrlQuery,
	callback: (helpers: ReturnType<typeof getParamFromUrlQuery>) => TState
): TState {
	return callback(getParamFromUrlQuery(query));
}
