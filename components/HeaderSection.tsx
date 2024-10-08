import {useMemo} from 'react';
import Image from 'next/image';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl, truncateHex} from '@builtbymom/web3/utils';

import {TokenSelectButton} from './TokenSelectButton';

import type {ReactElement} from 'react';

export function HeaderSection(): ReactElement {
	const {onConnect, address, ens, clusters, openLoginModal} = useWeb3();
	const ensOrClusters = useMemo(() => address && (ens || clusters?.name), [address, ens, clusters]);

	return (
		<>
			<Image
				src={'/header-bg.png'}
				className={'absolute z-0 hidden max-w-[1200px] md:flex'}
				width={2400}
				height={1000}
				alt={'header'}
			/>
			<Image
				src={'/header-bg-mobile.png'}
				className={'absolute z-0 flex h-[400px] object-cover md:hidden'}
				width={2400}
				height={1000}
				alt={'header'}
			/>
			<div className={'z-30 w-full max-w-[1200px] pb-[100px] md:pb-[140px]'}>
				<div className={'relative flex w-full justify-between px-6 py-4'}>
					<div className={'font-2xl flex items-center gap-2 font-bold text-primary'}>
						<div className={'size-8 rounded-full bg-primary'} />
						{'DILOGO'}
					</div>
					<button
						suppressHydrationWarning
						onClick={address ? openLoginModal : onConnect}
						className={cl(
							'rounded-lg bg-primary/10 p-3 text-xs',
							'font-bold text-primary md:px-[30px] md:text-sm',
							'hover:bg-primary/20 transition-all'
						)}>
						{ensOrClusters ? ensOrClusters : address ? truncateHex(address, 6) : 'Connect Wallet'}
					</button>
				</div>

				<div className={'z-10 mt-10 flex w-full flex-col justify-center'}>
					<div className={'flex flex-col items-center justify-center gap-6 md:flex-row md:gap-0'}>
						<h1 className={'mr-6 text-center font-medium'}>{'Send'}</h1>
						<TokenSelectButton />
					</div>
					<div className={'mt-[20px] flex justify-center'}>
						<h1 className={cl('w-fit text-center font-medium', '')}>{'to receivers:'}</h1>
					</div>
				</div>
			</div>
		</>
	);
}
