import {useMemo} from 'react';
import Image from 'next/image';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {truncateHex} from '@builtbymom/web3/utils';

import {SelectedTokenButton} from './SelectedTokenButton';

import type {ReactElement} from 'react'; 

export function HeaderSection(): ReactElement {
	const {onConnect, address, ens, clusters, openLoginModal} = useWeb3();
	const ensOrClusters = useMemo(() => address && (ens || clusters?.name), [address, ens, clusters]);

	return (
		<>
			<Image
				src={'/header-bg.png'}
				className={'absolute z-0 max-w-[1200px]'}
				width={2400}
				height={1000}
				alt={'header'}
			/>
			<div className={'z-30 w-full max-w-[1200px] pb-[100px]'}>
				<div className={'relative flex w-full justify-between px-6 py-4'}>
					<div className={'font-2xl text-primary flex items-center gap-2 font-bold'}> 
						<div className={'bg-primary size-8 rounded-full'} />
						{'DILOGO'}
					</div>
					<button
						suppressHydrationWarning
						onClick={address ? openLoginModal : onConnect}
						className={
							'bg-primary/10 text-primary rounded-lg p-3 text-xs font-bold md:px-[30px] md:text-sm'
						}>
						{ensOrClusters ? ensOrClusters : address ? truncateHex(address, 6) : 'Connect Wallet'}
					</button>
				</div>

				<div className={'z-10 mt-10 flex w-full flex-col justify-center'}>
					<div className={'flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0'}>
						<span
							className={
								'text-primary mr-6 text-center text-[40px] font-medium leading-[48px] md:text-[80px] md:leading-[88px]'
							}>
							{'Send'}
						</span>
						<SelectedTokenButton />
					</div>
					<div className={'weofiwe wefowe'}></div>
					<div className={'mt-[20px] flex justify-center'}>
						<p
							className={
								'text-primary w-fit text-center text-[40px] font-medium leading-[48px] md:text-[80px] md:leading-[88px]'
							}>
							{'to receivers:'}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
