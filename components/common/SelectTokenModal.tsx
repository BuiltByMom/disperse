import {Fragment, type ReactElement, useCallback, useMemo, useState} from 'react';
import {useWeb3} from '@builtbymom/web3/contexts/useWeb3';
import {cl} from '@builtbymom/web3/utils';
import {Dialog, DialogPanel, Transition, TransitionChild} from '@headlessui/react';

import {TokenButton} from './TokenButton';
import {useDisperse} from './contexts/useDisperse';
import {usePopularTokens} from './contexts/usePopularTokens';
import {usePrices} from './contexts/usePrices';
import {useTokensWithBalance} from './hooks/useTokensWithBalance';
import {IconCross} from './icons/IconCross';
import {IconSearch} from './icons/IconSearch';

import type {TToken} from '@builtbymom/web3/types';

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
									'rounded-3xl z-20 bg-background-modal !p-6 transition-all',
									'sm:my-8 sm:w-full md:max-w-2xl sm:max-w-lg'
								)}>
								<span className={'text-primary absolute left-6 top-6'}>{'Select token'}</span>
								<button
									className={
										'absolute right-6 top-6 p-2 text-neutral-600 transition-all hover:text-neutral-700'
									}
									onClick={onClose}>
									<IconCross className={'text-primary size-3'} />
								</button>
								<div className={'flex size-full  justify-start'}>
									{!address && (
										<div className={'flex flex-col items-center gap-6'}>
											<span className={'text-primary/40 text-sm'}>
												{'Get started by connecting your wallet'}
											</span>
											<button
												onClick={onConnect}
												className={
													'bg-accent flex h-16 items-center justify-center rounded-3xl text-base font-bold md:w-[320px]'
												}>
												{'Connect wallet'}
											</button>
										</div>
									)}
									<div className={'mt-10 flex w-full flex-col'}>
										<label className={'bg-primary/10 relative flex h-12 w-full rounded-2xl px-4 py-3'}>
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

										<div className={'mt-6 flex'}>
											<button
												onClick={() => set_currentTab('your_tokens')}
												className={cl(
													'border px-4 py-2 mr-2 text-primary font-bold text-base rounded-2xl',
													currentTab === 'your_tokens' ? 'border-accent' : 'border-primary/10'
												)}>
												{'Your tokens'}
											</button>
											<button
												onClick={() => set_currentTab('popular')}
												className={cl(
													'border px-4 py-2 text-primary font-bold text-base rounded-2xl',
													currentTab === 'popular' ? 'border-accent' : 'border-primary/10'
												)}>
												{'Popular'}
											</button>
										</div>
										<TokenList
											currentTab={currentTab}
											searchValue={searchValue.toLowerCase()}
											onCloseModal={onClose}
										/>
									</div>
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
	onCloseModal: VoidFunction
}): ReactElement {
	const {listTokens} = usePopularTokens();
	const {listTokensWithBalance} = useTokensWithBalance();
	const {dispatchConfiguration} = useDisperse();



	const tokensDict: {[key: string]: TToken[]} = useMemo(() => {
		return {
			your_tokens: listTokensWithBalance(),
			popular: listTokens(1)
		}; 
	}, [listTokens, listTokensWithBalance]);

	const {getPrices} = usePrices();
	const prices = getPrices(tokensDict[currentTab]);

	const searchFilteredTokens = useMemo(() => {
		return tokensDict[currentTab].filter(
			token =>
				token.address.toLowerCase().includes(searchValue) ||
				token.symbol.toLowerCase().includes(searchValue) ||
				token.name.toLowerCase().includes(searchValue)
		);
	}, [currentTab, searchValue, tokensDict]);

	const onSelectToken = useCallback((token: TToken) => {
		dispatchConfiguration({type: 'SET_TOKEN_TO_SEND', payload: token});
		onCloseModal();
	}, [dispatchConfiguration, onCloseModal]);

	return (
		<div className={'scrollbar-none overflow-y-auto'}>
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
