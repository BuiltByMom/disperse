import {cl} from '@builtbymom/web3/utils';

import type {ReactElement, ReactNode} from 'react';
import type {TWarningType} from './types/types';

type TWaringProps = {
	message: string | ReactNode;
	type: TWarningType;
};

export function Warning({message, type}: TWaringProps): ReactElement {
	const getWarningColor = (): string => {
		if (type === 'error') {
			return 'border-fail text-fail bg-fail/20';
		}
		if (type === 'warning') {
			return 'border-warning text-warning bg-warning/20';
		}
		return 'border-primary text-primary bg-primary/20';
	};

	return <div className={cl('w-full p-6 text-sm md:text-base rounded-2xl border', getWarningColor())}>{message}</div>;
}
