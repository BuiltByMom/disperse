import {createContext, useContext, useMemo, useReducer} from 'react';

import {optionalRenderProps} from '../types/optionalRenderProps';
import {useSendConfigurationReducer, useSendDefaultProps} from '../utils/useSend.helpres';

import type {ReactElement} from 'react';
import type {TOptionalRenderProps} from '../types/optionalRenderProps';
import type {TSendContext} from '../types/send.types';

const SendContext = createContext<TSendContext>(useSendDefaultProps);
export const SendContextApp = (props: {children: TOptionalRenderProps<TSendContext, ReactElement>}): ReactElement => {
	const [configuration, dispatch] = useReducer(useSendConfigurationReducer, useSendDefaultProps.configuration);

	const contextValue = useMemo(
		(): TSendContext => ({
			configuration,
			dispatchConfiguration: dispatch
		}),
		[configuration]
	);

	return (
		<SendContext.Provider value={contextValue}>
			{optionalRenderProps(props.children, contextValue)}
		</SendContext.Provider>
	);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const useSendContext = (): TSendContext => {
	const ctx = useContext(SendContext);
	if (!ctx) {
		throw new Error('SendContext not found');
	}
	return ctx;
};
