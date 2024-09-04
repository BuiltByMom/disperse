import type {TAddress} from '@builtbymom/web3/types';

export type TInputAddressLike = { 
	address: TAddress | undefined;
	label: string;
	isValid: boolean | 'undetermined';
	source?: 'typed' | 'addressBook' | 'defaultValue' | 'autoPopulate';
	error?: string;
};

export const defaultInputAddressLike: TInputAddressLike = {
	address: undefined,
	label: '',
	error: '',
	isValid: 'undetermined', 
	source: 'typed'
};
