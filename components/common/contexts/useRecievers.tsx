import {createContext, useContext, useState} from 'react';
import {useDeepCompareMemo} from '@react-hookz/web';

import {optionalRenderProps} from '../types/optionalRenderProps';

import type {Dispatch, ReactElement, SetStateAction} from 'react';
import type {TAddress} from '@builtbymom/web3/types';
import type {TOptionalRenderProps} from '../types/optionalRenderProps';

type TReceiver = {
	address: TAddress;
	amount: bigint;
};

type TReceiversContext = {
	configuration: TReceiverConfiguration;
	dispatch: Dispatch<SetStateAction<TReceiverConfiguration>>;
};

type TReceiverConfiguration = {
	receivers: TReceiver[];
};
const defaultProps = {
	configuration: {
		receivers: []
	},
	dispatch: (): void => undefined
};

const ReceiversContext = createContext<TReceiversContext>(defaultProps);
export const ReceiversContextApp = ({
	children
}: {
	children: TOptionalRenderProps<TReceiversContext, ReactElement>;
}): ReactElement => {
	const [configuration, set_configuration] = useState<{receivers: TReceiver[]}>(defaultProps.configuration);

	const contextValue = useDeepCompareMemo(
		(): TReceiversContext => ({configuration, dispatch: set_configuration}),
		[configuration]
	);

	return (
		<ReceiversContext.Provider value={contextValue}>
			{optionalRenderProps(children, contextValue)}
		</ReceiversContext.Provider>
	);
};

export const useReceivers = (): TReceiversContext => {
	const ctx = useContext(ReceiversContext);
	if (!ctx) {
		throw new Error('SearchContext not found');
	}
	return ctx;
};
