import {type ReactElement, useEffect, useState} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl} from '@builtbymom/web3/utils';

import {ConnectWalletModal} from './common/ConnectWalletModal';
import {useDisperse} from './common/contexts/useDisperse';
import {usePrices} from './common/contexts/usePrices';
import {IconChevron} from './common/icons/IconChevrov';
import {SelectTokenModal} from './common/SelectTokenModal';
import {TokenButton} from './common/TokenButton';

import type {TNormalizedBN} from '@builtbymom/web3/types';

export function TokenSelectButton(): ReactElement {
	const [isSelectTokenModalOpen, set_isSelectTokenModalOpen] = useState(false);
	const {configuration} = useDisperse();
	const {getPrice, pricingHash} = usePrices();
	const {address} = useWeb3();

	const [price, set_price] = useState<TNormalizedBN | undefined>(undefined);

	/**********************************************************************************************
	 ** This effect hook will be triggered when the property token, safeChainID or the
	 ** pricingHash changes, indicating that we need to update the price for the current token.
	 ** It will ask the usePrices context to retrieve the prices for the tokens (from cache), or
	 ** fetch them from an external endpoint (depending on the price availability).
	 *********************************************************************************************/
	useEffect(() => {
		if (!configuration.tokenToSend) {
			return;
		}
		set_price(getPrice(configuration.tokenToSend));
	}, [configuration.tokenToSend, pricingHash, getPrice]);

	return (
		<>
			{!address ? (
				<ConnectWalletModal
					isOpen={isSelectTokenModalOpen}
					onClose={() => set_isSelectTokenModalOpen(false)}
				/>
			) : (
				<SelectTokenModal
					isOpen={isSelectTokenModalOpen}
					onClose={() => set_isSelectTokenModalOpen(false)}
				/>
			)}
			<div className={'rounded-[64px] bg-secondary'}>
				<button
					onClick={() => set_isSelectTokenModalOpen(true)}
					className={cl(
						'flex h-min items-center justify-center rounded-[64px]',
						'border border-accent bg-background-modal/90 px-6 py-4',
						'hover:bg-primary/10 hover:border-accent transition-all',
						configuration?.tokenToSend?.address && 'border-primary/10'
					)}>
					{configuration.tokenToSend?.address ? (
						<TokenButton
							price={price}
							token={configuration.tokenToSend}
							className={'mr-3 !p-0 transition-all hover:!bg-transparent'}
						/>
					) : (
						<h2 className={'mr-[22px]'}>{'Token'}</h2>
					)}
					<IconChevron />
				</button>
			</div>
		</>
	);
}
