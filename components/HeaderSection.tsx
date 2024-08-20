import {useMemo, useState} from 'react';
import Image from 'next/image';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {truncateHex} from '@builtbymom/web3/utils';

import {IconChevron} from './common/icons/IconChevrov';
import {SelectTokenModal} from './common/SelectTokenModal';

import type {ReactElement} from 'react';

export function HeaderSection(): ReactElement {
	const {onConnect, address, ens, clusters, openLoginModal} = useWeb3();
	const ensOrClusters = useMemo(() => address && (ens || clusters?.name), [address, ens, clusters]);
	const [isSelectTokenModalOpen, set_isSelectTokenModalOpen] = useState(false);

	/**********************************************************************************************
	 ** TODO: write comment of what it does
	 *********************************************************************************************/
	const modalLayout = (): ReactElement => {
		return (
			<div>
				{!address && (
					<div className={'flex flex-col items-center gap-6'}>
						<span className={'text-sm text-primary/40'}>{'Get started by connecting your wallet'}</span>
						<button
							onClick={onConnect}
							className={
								'flex h-16 items-center justify-center rounded-3xl bg-accent text-base font-bold md:w-[320px]'
							}>
							{'Connect wallet'}
						</button>
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<Image
				src={'/header-bg.png'}
				className={'absolute z-0 max-w-[1200px]'}
				width={2400}
				height={1000}
				alt={'header'}
			/>
			<SelectTokenModal
				isOpen={isSelectTokenModalOpen}
				onClose={() => set_isSelectTokenModalOpen(false)}>
				<div>{modalLayout()}</div>
			</SelectTokenModal>
			<div className={'z-30 w-full max-w-[1200px] pb-[100px]'}>
				<div className={'relative flex w-full justify-between px-6 py-4'}>
					<div className={'font-2xl flex items-center gap-2 font-bold text-primary'}>
						<div className={'size-8 rounded-full bg-primary'} />
						{'DILOGO'}
					</div>
					<button
						suppressHydrationWarning
						onClick={address ? openLoginModal : onConnect}
						className={
							'rounded-lg bg-primary/10 p-3 text-xs font-bold text-primary md:px-[30px] md:text-sm'
						}>
						{ensOrClusters ? ensOrClusters : address ? truncateHex(address, 6) : 'Connect Wallet'}
					</button>
				</div>

				<div className={'z-10 mt-10 flex w-full flex-col justify-center'}>
					<div className={'flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0'}>
						<span
							className={
								'mr-6 text-center text-[40px] font-medium leading-[48px] text-primary md:text-[80px] md:leading-[88px]'
							}>
							{'Send'}
						</span>
						<div className={'rounded-[64px] bg-black'}>
							<button
								onClick={() => set_isSelectTokenModalOpen(true)}
								className={
									'flex h-min items-center justify-center rounded-[64px] border border-accent bg-background-modal/90 px-6 py-4'
								}>
								<span className={'mr-[22px] text-[32px] leading-[32px] text-primary'}>{'Token'}</span>
								<IconChevron />
							</button>
						</div>
					</div>
					<div className={'weofiwe wefowe'}></div>
					<div className={'mt-[20px] flex justify-center'}>
						<p
							className={
								'w-fit text-center text-[40px] font-medium leading-[48px] text-primary md:text-[80px] md:leading-[88px]'
							}>
							{'to receivers:'}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
