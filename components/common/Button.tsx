import {type ComponentPropsWithoutRef, type ForwardedRef, forwardRef, type MouseEvent, type ReactElement} from 'react';
import {cl} from '@builtbymom/web3/utils';

import {IconSpinner} from './icons/IconSpinner';

type TButtonProps = {
	children: ReactElement;
	isBusy?: boolean;
	isDisabled?: boolean;
	shouldStopPropagation?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export type TMouseEvent = MouseEvent<HTMLButtonElement> & MouseEvent<HTMLAnchorElement>;

export const Button = forwardRef(
	(
		{children, isBusy = false, shouldStopPropagation = false, isDisabled = false, ...rest}: TButtonProps,
		ref: ForwardedRef<HTMLButtonElement> | null
	): ReactElement => {
		return (
			<button
				{...(rest as ComponentPropsWithoutRef<'button'>)}
				ref={ref}
				className={cl(
					'col-span-1 relative w-full h-16 items-center rounded-3xl bg-secondary font-bold text-center text-base text-primary',
					'disabled:text-primary disabled:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed',
					isBusy ? 'bg-secondary opacity-40 text-primary' : '',
					rest.className
				)}
				disabled={isDisabled}
				onClick={(event: TMouseEvent): void => {
					if (shouldStopPropagation) {
						event.stopPropagation();
					}
					if (!isBusy && rest.onClick) {
						rest.onClick(event);
					}
				}}
				aria-busy={isBusy}>
				{!isBusy && children}
				{isBusy ? (
					<span className={'absolute inset-0 flex items-center justify-center'}>
						<IconSpinner className={'size-6 animate-spin text-primary'} />
					</span>
				) : null}
			</button>
		);
	}
);
