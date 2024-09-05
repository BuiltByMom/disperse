import {type ReactElement, useCallback, useMemo, useState} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {cl} from '@builtbymom/web3/utils';
import {useMountEffect} from '@react-hookz/web';

import {ModalWrapper} from './ModalWrapper';
import {TokenButton} from './TokenButton';
import {TokensFilterTab} from './TokensFilterTab';
import {useDisperse} from './contexts/useDisperse';
import {usePopularTokens} from './contexts/usePopularTokens';
import {usePrices} from './contexts/usePrices';
import {useTokensWithBalance} from './hooks/useTokensWithBalance';
import {IconSearch} from './icons/IconSearch';

import type {TToken} from '@builtbymom/web3/types';

type TSelectTokenModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
};

export function SelectTokenModal({isOpen, onClose}: TSelectTokenModalProps): ReactElement {
	const {address} = useWeb3();
	const [searchValue, set_searchValue] = useState('');
	const [currentTab, set_currentTab] = useState<'your_tokens' | 'popular'>('your_tokens');

	return (
		<ModalWrapper
			title={'Select token'}
			isOpen={isOpen}
			shouldExpandOnMobile={true}
			onClose={onClose}>
			<div className={'flex size-full justify-center'}>
				<div className={'mt-10 flex w-full flex-col'}>
					<div className={'px-6'}>
						<label className={'relative flex h-12 w-full rounded-2xl bg-primary/10 px-4 py-3'}>
							<input
								className={cl(
									'w-full border-none outline-0 rounded-lg bg-transparent py-3 px-4',
									'placeholder:text-neutral-600 text-primary',
									'focus:placeholder:text-neutral-300 placeholder:transition-colors',
									'focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40'
								)}
								type={'text'}
								placeholder={'0x... or Name'}
								autoComplete={'off'}
								autoCorrect={'off'}
								spellCheck={'false'}
								value={searchValue}
								disabled={!address}
								onChange={e => set_searchValue(e.target.value)}
							/>
							<div className={'absolute right-4 top-3'}>
								<IconSearch className={'text-primary/40'} />
							</div>
						</label>
					</div>

					<div className={'mb-4 mt-6 flex px-6'}>
						<TokensFilterTab
							currentTab={currentTab}
							tab={{value: 'your_tokens', label: 'Your tokens'}}
							onClick={() => set_currentTab('your_tokens')}
							className={'mr-2'}
						/>
						<TokensFilterTab
							currentTab={currentTab}
							tab={{value: 'popular', label: 'Popular'}}
							onClick={() => set_currentTab('popular')}
						/>
					</div>
					<TokenList
						currentTab={currentTab}
						searchValue={searchValue.toLowerCase()}
						onCloseModal={onClose}
					/>
				</div>
			</div>
		</ModalWrapper>
	);
}

function TokenList({
	currentTab,
	searchValue,
	onCloseModal
}: {
	currentTab: 'your_tokens' | 'popular';
	searchValue: string;
	onCloseModal: VoidFunction;
}): ReactElement {
	const {listTokens} = usePopularTokens();
	const {listTokensWithBalance} = useTokensWithBalance();
	const {dispatchConfiguration} = useDisperse();
	const {chainID} = useChainID();

	const popularTokens = listTokens(chainID);
	const tokensWithBalance = listTokensWithBalance();
	const [prices, set_prices] = useState({});

	/**********************************************************************************************
	 ** tokensDict function creates a memoized dictionary of tokens categorized by type. It maps
	 ** 'your_tokens' to tokensWithBalance and 'popular' to popularTokens, updating only when
	 ** dependencies change.
	 *********************************************************************************************/
	const tokensDict: {[key: string]: TToken[]} = useMemo(() => {
		return {
			your_tokens: tokensWithBalance,
			popular: popularTokens
		};
	}, [popularTokens, tokensWithBalance]);

	const {getPrices} = usePrices();

	useMountEffect(() => {
		const allTokens = tokensDict[currentTab].map(token => ({chainID: token.chainID, address: token.address}));
		const prices = getPrices(allTokens as TToken[]);
		set_prices(prices);
	});

	/**********************************************************************************************
	 ** searchFilteredTokens function computes a filtered list of tokens based on the current tab
	 ** and search value. It returns a slice of popular tokens, tokens with a balance, or filters
	 ** tokens by address, symbol, or name according to the search value. It is memoized with
	 ** useMemo to optimize performance.
	 *********************************************************************************************/
	const searchFilteredTokens = useMemo(() => {
		if (!searchValue && currentTab === 'popular') {
			return [...popularTokens].slice(0, 30);
		}
		if (!searchValue && currentTab === 'your_tokens') {
			return [...tokensWithBalance];
		}
		return tokensDict[currentTab].filter(
			token =>
				token.address.toLowerCase().includes(searchValue) ||
				token.symbol.toLowerCase().includes(searchValue) ||
				token.name.toLowerCase().includes(searchValue)
		);
	}, [currentTab, popularTokens, searchValue, tokensDict, tokensWithBalance]);

	/**********************************************************************************************
	 ** onSelectToken function dispatches an action to update the selected token in the state and
	 ** then closes the modal. It is memoized using useCallback to avoid unnecessary re-renders.
	 *********************************************************************************************/
	const onSelectToken = useCallback(
		(token: TToken) => {
			dispatchConfiguration({type: 'SET_TOKEN_TO_SEND', payload: token});
			onCloseModal();
		},
		[dispatchConfiguration, onCloseModal]
	);

	return (
		<div className={'overflow-y-auto scrollbar-none'}>
			{searchFilteredTokens.map(token => (
				<TokenButton
					token={token}
					prices={prices}
					onClick={() => onSelectToken(token)}
					key={token.address}
				/>
			))}
		</div>
	);
}
