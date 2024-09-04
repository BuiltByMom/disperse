import React, {createContext, useCallback, useContext, useMemo, useReducer, useState} from 'react';
import {zeroNormalizedBN} from '@builtbymom/web3/utils';

import {type TDisperseContext, type TDisperseInput} from '../types/disperse.types';
import {optionalRenderProps} from '../types/optionalRenderProps';
import {defaultInputAddressLike} from '../utils/tools.address';

import type {ReactElement} from 'react';
import type {TOptionalRenderProps} from '../types/optionalRenderProps';

import {useDisperseConfigurationReducer, useDisperseDefaultProps} from '@/components/disperse/useDisperse.helpers';

export function newVoidRow(): TDisperseInput {
	return {
		receiver: defaultInputAddressLike,
		value: {
			amount: '',
			normalizedBigAmount: zeroNormalizedBN,
			isValid: 'undetermined',
			status: 'none'
		},
		UUID: crypto.randomUUID()
	};
}

const DisperseContext = createContext<TDisperseContext>(useDisperseDefaultProps);
export const DisperseContextApp = (props: {
	children: TOptionalRenderProps<TDisperseContext, ReactElement>;
}): ReactElement => {
	const [isDispersed, set_isDispersed] = useState<boolean>(false);
	const [configuration, dispatch] = useReducer(
		useDisperseConfigurationReducer,
		useDisperseDefaultProps.configuration
	);

	/**********************************************************************************************
	 ** onResetDisperse is a callback function that will reset the disperse configuration and
	 ** disperse the UI.
	 ** It will first set the `isDispersed` state to true, then wait for 500ms before resetting the
	 ** configuration and setting the `isDispersed` state to false.
	 *********************************************************************************************/
	const onResetDisperse = useCallback((): void => {
		set_isDispersed(true);
		setTimeout((): void => {
			dispatch({type: 'RESET', payload: undefined});
			set_isDispersed(false);
		}, 500);
	}, []);

	/**********************************************************************************************
	 ** contextValue is a memoized object that will be passed to the DisperseContext.Provider in
	 ** order to provide the context to the children components and prevent some unwanted
	 ** re-renders.
	 *********************************************************************************************/
	const contextValue = useMemo(
		(): TDisperseContext => ({
			configuration,
			dispatchConfiguration: dispatch,
			isDispersed,
			onResetDisperse
		}),
		[configuration, onResetDisperse, isDispersed]
	);

	return (
		<DisperseContext.Provider value={contextValue}>
			{optionalRenderProps(props.children, contextValue)}
		</DisperseContext.Provider>
	);
};

/**************************************************************************************************
 ** Context accessor
 *************************************************************************************************/
export const useDisperse = (): TDisperseContext => {
	const ctx = useContext(DisperseContext);
	if (!ctx) {
		throw new Error('DisperseContext not found');
	}
	return ctx;
};
