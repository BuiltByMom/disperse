import {Fragment, type ReactElement} from 'react';
import {cl} from '@builtbymom/web3/utils';
import {Dialog, DialogPanel, Transition, TransitionChild} from '@headlessui/react';

import {IconCross} from './icons/IconCross';

export function SelectTokenModal({
	children,
	isOpen,
	onClose
}: {
	children: ReactElement;
	isOpen: boolean;
	onClose: VoidFunction;
}): ReactElement {
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
									'relative overflow-hidden min-h-[455px] flex max-w-2xl flex-col items-center justify-center border border-primary/10 rounded-3xl bg-background-modal !p-10 transition-all',
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
								{children}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
