import {useMemo} from 'react';
import Image from 'next/image';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {truncateHex} from '@builtbymom/web3/utils';

import {useDisperse} from './common/contexts/useDisperse';
import {IconChevron} from './common/icons/IconChevrov';

import type {ReactElement} from 'react';

export function HeaderSection(): ReactElement {
	const {onConnect, address, ens, clusters, openLoginModal} = useWeb3();
	const ensOrClusters = useMemo(() => address && (ens || clusters?.name), [address, ens, clusters]);
	const {configuration} = useDisperse();

	const getLabel = (): string => {
		if (configuration.inputs.length > 0) {
			return 'to receivers:';
		}
		return 'to many addresses';
	};

	return (
		<>
			<Image
				src={'/header-bg.png'}
				className={'absolute max-w-[1200px]'}
				width={2400}
				height={1000}
				alt={'header'}
			/>
			<div className={'z-10 w-full max-w-[1200px] pb-[100px]'}>
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
							{getLabel()}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
