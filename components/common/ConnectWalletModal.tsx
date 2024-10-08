import {type ReactElement} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';

import {ModalWrapper} from './ModalWrapper';

type TConnectWalletModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
};

export function ConnectWalletModal({isOpen, onClose}: TConnectWalletModalProps): ReactElement {
	const {onConnect} = useWeb3();
	return (
		<ModalWrapper
			isOpen={isOpen}
			title={'Select token'}
			onClose={onClose}>
			<div className={'flex size-full items-center justify-center'}>
				<div className={'flex flex-col items-center gap-6'}>
					<span className={'text-sm text-primary/40'}>{'Get started by connecting your wallet'}</span>
					<button
						onClick={onConnect}
						className={
							'flex h-16 items-center justify-center rounded-3xl bg-accent p-4 font-bold md:w-[320px]'
						}>
						{'Connect wallet'}
					</button>
				</div>
			</div>
		</ModalWrapper>
	);
}
