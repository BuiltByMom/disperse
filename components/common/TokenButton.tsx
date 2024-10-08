import {type ReactElement, useMemo} from 'react';
import Link from 'next/link';
import {useTokenList} from '@builtbymom/web3/contexts/WithTokenList';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {cl, formatAmount, isAddress, toAddress, toBigInt, truncateHex} from '@builtbymom/web3/utils';

import {ImageWithFallback} from './ImageWithFallback';
import {IconWallet} from './icons/IconWallet';

import type {TDict, TNDict, TNormalizedBN, TToken} from '@builtbymom/web3/types';

export function TokenButton(props: {
	token: TToken;
	className?: string;
	onClick?: VoidFunction;
	prices?: TNDict<TDict<TNormalizedBN>>;
	price?: TNormalizedBN;
}): ReactElement {
	const {getToken} = useTokenList();
	const {chainID} = useChainID();

	/**********************************************************************************************
	 ** The tokenIcon memoized value contains the URL of the token icon. Based on the provided
	 ** information and what we have in the token list, we will try to find the correct icon source
	 *********************************************************************************************/
	const tokenIcon = useMemo(() => {
		if (!props.token) {
			return '/placeholder.png';
		}
		if (props.token?.logoURI) {
			return props.token.logoURI;
		}
		const tokenFromList = getToken({chainID: chainID, address: props.token.address});
		if (tokenFromList?.logoURI) {
			return tokenFromList.logoURI;
		}
		return `${process.env.SMOL_ASSETS_URL}/token/${chainID}/${props.token.address}/logo-32.png`;
	}, [chainID, getToken, props.token]);

	/**********************************************************************************************
	 ** The balanceValue memoized value contains the string representation of the token balance,
	 ** in USD. If the token balance is zero, it will display 'N/A'.
	 *********************************************************************************************/
	const balanceValue = useMemo(() => {
		if (!props.token) {
			return 'N/A';
		}
		const price = props.prices?.[chainID]?.[toAddress(props.token.address)];
		if (toBigInt(price?.raw) === 0n) {
			return 'N/A';
		}
		const value = props.token.balance.normalized * (price?.normalized || 0);

		const formatedValue = formatAmount(value, 2);
		return `$${formatedValue}`;
	}, [chainID, props.prices, props.token]);

	/**********************************************************************************************
	 ** The tokenBalance memoized value contains the string representation of the token balance,
	 ** correctly formated. If the balance is dusty, it will display '> 0.000001' instead of '0'.
	 *********************************************************************************************/
	const tokenBalance = useMemo(() => {
		if (!props.token) {
			return '';
		}
		const formatedBalance = formatAmount(props.token.balance.normalized, 0, 6);
		if (Number(formatedBalance) < 0) {
			return '< 0.000001';
		}
		if (Number(formatedBalance) === 0) {
			return '0.00';
		}
		return formatedBalance;
	}, [props.token]);

	const buttonLayout: ReactElement = (
		<div className={cl('flex w-full justify-between')}>
			<div className={cl('flex w-full justify-between gap-4 items-center')}>
				{props.token && isAddress(props.token.address) ? (
					<ImageWithFallback
						src={tokenIcon}
						alt={props.token?.symbol}
						altSrc={`${process.env.SMOL_ASSETS_URL}/token/${chainID}/${props.token?.address}/logo-32.png`}
						quality={90}
						width={32}
						height={32}
					/>
				) : (
					<div className={'bg-neutral-0 flex size-8 items-center justify-center rounded-full'}>
						<IconWallet className={'size-4 text-primary'} />
					</div>
				)}
				<div className={'w-full max-w-[400px] text-left'}>
					<p className={'whitespace-normal font-normal'}>{props.token?.symbol || props.token?.name}</p>
					{!!props.token?.address && (
						<p className={'text-xs text-primary/40'}>{truncateHex(props.token.address, 5)}</p>
					)}
				</div>
				{props.token && (
					<div className={'size-full whitespace-nowrap  text-right font-normal text-primary'}>
						<span className={'text-left'}>{tokenBalance}</span>
						<p className={cl('text-xs', 'text-grey-700')}>&nbsp;{balanceValue}</p>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<>
			{props.onClick ? (
				<Link
					href={`?token=${props.token.address}`}
					onClick={props.onClick}
					className={cl(
						'flex flex-row gap-2 items-center justify-between py-4 px-6 w-full cursor-pointer',
						'disabled:cursor-not-allowed disabled:opacity-20',
						'hover:bg-primary/10 transition-all',
						props.className
					)}>
					{buttonLayout}
				</Link>
			) : (
				<div
					onClick={props.onClick}
					className={cl(
						'flex flex-row gap-2 items-center justify-between py-4 px-6 w-full cursor-pointer',
						'disabled:cursor-not-allowed disabled:opacity-20',
						'hover:bg-primary/10 transition-all',
						props.className
					)}>
					{buttonLayout}
				</div>
			)}
		</>
	);
}
