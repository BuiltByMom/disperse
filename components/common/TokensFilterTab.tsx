import {cl} from '@builtbymom/web3/utils';

import type {ReactElement} from 'react';
import type {TTab} from './types/types';

export function TokensFilterTab({
	currentTab,
	tab,
	onClick,
	className
}: {
	currentTab: TTab;
	tab: {value: TTab; label: string};
	onClick: () => void;
	className?: string;
}): ReactElement {
	return (
		<button
			onClick={onClick}
			className={cl(
				'border px-4 py-2 text-primary font-bold text-base rounded-2xl transition-all hover:bg-primary/10',
				currentTab === tab.value ? 'border-accent' : 'border-primary/10',
				className
			)}>
			{tab.label}
		</button>
	);
}
