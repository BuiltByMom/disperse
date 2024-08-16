import {truncateHex} from '@builtbymom/web3/utils';
import {ReactElement, useMemo} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import Image from 'next/image';
import {IconChevron} from './common/icons/IconChevrov';
import {useReceivers} from './common/contexts/useRecievers';

export function HeaderSection(): ReactElement {
	const {onConnect, address, ens, clusters, openLoginModal} = useWeb3();
	const ensOrClusters = useMemo(() => address && (ens || clusters?.name), [address, ens, clusters]);

	const {configuration} = useReceivers();

	const getLabel = () => {
		if (configuration.receivers.length > 0) {
			return 'to recceivers';
		}
		return 'to many addresses';
	};

	return (
		<>
			<Image
				src={'/header-bg.png'}
				className="absolute max-w-[1200px]"
				width={2400}
				height={1000}
				alt="header"
			/>
			<div className=" z-10 max-w-[1200px] w-full">
				<div className="relative py-4 px-6 flex w-full justify-between">
					<div className="text-primary flex items-center gap-2 font-bold font-2xl">
						<div className="bg-primary size-8 rounded-full" />
						DILOGO
					</div>
					<button
						suppressHydrationWarning
						onClick={address ? openLoginModal : onConnect}
						className={'rounded-lg bg-primary/10 p-3 text-sm font-bold text-primary md:px-[30px]'}>
						{ensOrClusters ? ensOrClusters : address ? truncateHex(address, 6) : 'Connect Wallet'}
					</button>
				</div>

				<div className="z-10 w-full flex-col flex justify-center mt-10">
					<div className="flex items-center justify-center">
						<span className="text-primary mr-6 text-[80px] leading-[80px] font-medium">Send</span>
						<div className="rounded-[64px] bg-black">
							<button className="py-4 bg-background-modal/90 px-6 h-min rounded-[64px] flex items-center justify-center border border-accent">
								<span className="text-[32px] mr-[22px] leading-[32px] text-primary">Token</span>
								<IconChevron />
							</button>
						</div>
					</div>
					<div className="flex justify-center mt-[20px]">
						<p className="text-primary w-fit text-[80px] leading-[88px] font-medium">{getLabel()}</p>
					</div>
				</div>
			</div>
		</>
	);
}
