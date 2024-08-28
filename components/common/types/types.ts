import type {Dispatch,SetStateAction} from 'react';

export type TTab = 'your_tokens' | 'popular'

export type TWarningType = 'error' | 'warning' | 'info';

export type TValidateContext = {
	configuration: {
        isDisperseAllowed: boolean
    };
	dispatch: Dispatch<SetStateAction<TValidateContext>>;
};
