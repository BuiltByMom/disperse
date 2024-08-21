import {type ReactElement, useState} from 'react';
import {toAddress} from '@builtbymom/web3/utils';

import {useDisperse} from './common/contexts/useDisperse';
import {usePrices} from './common/contexts/usePrices';
import {IconChevron} from './common/icons/IconChevrov';
import {SelectTokenModal} from './common/SelectTokenModal';
import {TokenButton} from './common/TokenButton';

import {APP_CHAIN_ID} from '@/constants';

export function SelectedTokenButton(): ReactElement {
	const [isSelectTokenModalOpen, set_isSelectTokenModalOpen] = useState(false);
	const {configuration} = useDisperse();
	const {getPrice} = usePrices();
	const price = getPrice({
		chainID: APP_CHAIN_ID,
		address: toAddress(configuration.tokenToSend?.address)
	});

	return (
		<>
			<SelectTokenModal
				isOpen={isSelectTokenModalOpen}
				onClose={() => set_isSelectTokenModalOpen(false)}
			/>
			<div className={'rounded-[64px] bg-black'}>
				<button
					onClick={() => set_isSelectTokenModalOpen(true)}
					className={
						'border-accent bg-background-modal/90 flex h-min items-center justify-center rounded-[64px] border px-6 py-4'
					}>
					{configuration.tokenToSend?.address ? (
						<TokenButton
							price={price}
							token={configuration.tokenToSend}
							className={'mr-3 !p-0'}
						/>
					) : (
						<span className={'text-primary mr-[22px] text-[32px] leading-[32px]'}>{'Token'}</span>
					)}
					<IconChevron />
				</button>
			</div>
		</>
	);
}
