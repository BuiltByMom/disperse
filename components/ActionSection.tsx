import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';

import {useDisperse} from './common/contexts/useDisperse';

import type {ReactElement} from 'react';

export function ActionSection(): ReactElement | null {
	const {address, onConnect} = useWeb3();
	const {configuration} = useDisperse();
	const getButtonTitle = (): string => {
		if (!address) {
			return 'Connect wallet';
		}
		return 'Approve and Disperse';
	};

    const onAction = (): void => {
        if(!address) {
            onConnect();
        }
    };

    if(configuration.inputs.length < 1) {
        return null;
    }

	return (
		<div className={'mb-40 mt-20 grid w-full grid-cols-3 gap-7 rounded-3xl bg-accent md:px-16 md:py-[60px]'}>
			<div className={'flex flex-col items-start justify-start gap-2'}>
				<span className={'text-base font-medium'}>{'Total to Disperse:'}</span>
				{!address && <span className={'text-[32px] font-medium leading-[32px]'}>{'Wallet not connected'}</span>}
			</div>
			<div className={'flex w-full flex-col items-start gap-2'}>
				<span className={'text-start text-base font-medium'}>{'Total receivers:'}</span>
				<span className={'text-[32px] font-medium leading-[32px]'}>{configuration.inputs.length}</span>
			</div>
			<div className={'flex '}>
				<button onClick={onAction} className={'col-span-1 w-full items-center rounded-3xl bg-secondary text-center text-base text-primary'}>{getButtonTitle()}</button>
			</div>
		</div>
	);
}
