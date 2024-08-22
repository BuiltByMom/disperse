import {Fragment, type ReactElement, useCallback, useMemo, useState} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl} from '@builtbymom/web3/utils';
import {Dialog, DialogPanel, Transition, TransitionChild} from '@headlessui/react';

import {TokenButton} from './TokenButton';
import {TokensFilterTab} from './TokensFilterTab';
import {useDisperse} from './contexts/useDisperse';
import {usePopularTokens} from './contexts/usePopularTokens';
import {usePrices} from './contexts/usePrices';
import {useTokensWithBalance} from './hooks/useTokensWithBalance';
import {IconCross} from './icons/IconCross';
import {IconSearch} from './icons/IconSearch';

import type {TToken} from '@builtbymom/web3/types';

import {APP_CHAIN_ID} from '@/constants';

export function SelectTokenModal({isOpen, onClose}: {isOpen: boolean; onClose: VoidFunction}): ReactElement {
	const {onConnect, address} = useWeb3();
	const [searchValue, set_searchValue] = useState('');
	const [currentTab, set_currentTab] = useState<'your_tokens' | 'popular'>('your_tokens');

	return (
		<Transition
			show={isOpen}
			as={Fragment}>
			<Dialog
				as={'div'}
				className={'relative z-[1000]'}
				onClose={onClose}>
				<TransitionChild
					as={Fragment}
					enter={'ease-out duration-300'}
					enterFrom={'opacity-0'}
					enterTo={'opacity-100'}
					leave={'ease-in duration-200'}
					leaveFrom={'opacity-100'}
					leaveTo={'opacity-0'}>
					<div className={'fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity'} />
				</TransitionChild>

				<div className={'fixed inset-0 z-[1001] overflow-y-auto'}>
					<div
						className={
							'flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'
						}>
						<TransitionChild
							as={Fragment}
							enter={'ease-out duration-300'}
							enterFrom={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
							enterTo={'opacity-100 translate-y-0 sm:scale-100'}
							leave={'ease-in duration-200'}
							leaveFrom={'opacity-100 translate-y-0 sm:scale-100'}
							leaveTo={'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}>
							<DialogPanel
								className={cl(
									'relative overflow-hidden justify-start h-[500px]',
									'flex max-w-2xl flex-col items-center border border-primary/10',
									'rounded-3xl z-20 bg-background-modal !py-6 transition-all',
									'sm:my-8 sm:w-full md:max-w-2xl sm:max-w-lg'
								)}>
								<span className={'absolute left-6 top-6 text-primary'}>{'Select token'}</span>
								<button
									className={
										'absolute right-6 top-6 p-2 text-neutral-600 transition-all hover:text-neutral-700'
									}
									onClick={onClose}>
									<IconCross className={'size-3 text-primary'} />
								</button>
								<div className={'flex size-full justify-center'}>
									{!address ? (
										<div className={'flex size-full items-center justify-center'}>
											<div className={'flex flex-col items-center gap-6'}>
												<span className={'text-sm text-primary/40'}>
													{'Get started by connecting your wallet'}
												</span>
												<button
													onClick={onConnect}
													className={
														'flex h-16 items-center justify-center rounded-3xl bg-accent text-base font-bold md:w-[320px]'
													}>
													{'Connect wallet'}
												</button>
											</div>
										</div>
									) : (
										<div className={'mt-10 flex w-full flex-col'}>
											<div className={'px-6'}>
												<label
													className={
														'relative flex h-12 w-full rounded-2xl bg-primary/10 px-4 py-3'
													}>
													<input
														className={cl(
															'w-full border-none outline-0 rounded-lg bg-transparent py-3 px-4 text-base',
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
									)}
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
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

	const popularTokens = listTokens(APP_CHAIN_ID);
	const tokensWithBalance = listTokensWithBalance();

	/**********************************************************************************************
	 ** TODO: Add a comment of what it does
	 *********************************************************************************************/
	const tokensDict: {[key: string]: TToken[]} = useMemo(() => {
		return {
			your_tokens: tokensWithBalance,
			popular: popularTokens
		};
	}, [popularTokens, tokensWithBalance]);

	const {getPrices} = usePrices();
	const prices = getPrices(tokensDict[currentTab]);

	/**********************************************************************************************
	 ** TODO: Add a comment of what it does
	 *********************************************************************************************/
	const searchFilteredTokens = useMemo(() => {
		if (!searchValue && currentTab === 'popular') {
			return [...popularTokens].slice(0, 20);
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
	 ** TODO: Add a comment of what it does
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
