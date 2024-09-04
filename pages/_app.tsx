import {WalletContextApp} from '@builtbymom/web3/contexts/useWallet';
import {WithMom} from '@builtbymom/web3/contexts/WithMom';
import {SafeProvider} from '@gnosis.pm/safe-apps-react-sdk';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '@/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import {DisperseContextApp} from '@/components/common/contexts/useDisperse';
import {WithPopularTokens} from '@/components/common/contexts/usePopularTokens';
import {WithPrices} from '@/components/common/contexts/usePrices';
import {Meta} from '@/components/common/Meta';
import {WithFonts} from '@/components/common/WithFonts';
import {supportedNetworks} from '@/utils/tools.chains';

export default function App({Component, pageProps}: AppProps): ReactElement {
	return (
		<WithFonts>
			<Meta
				title={'Disperse - A Dapp for Dispersing ERC20 Tokens'}
				description={'Disperse is a Dapp for dispersing ERC20 tokens to multiple wallets'}
				og={'public/OG.png'}
				titleColor={''}
				themeColor={''}
				uri={''}
			/>
			<WithMom
				supportedChains={supportedNetworks}
				tokenLists={['https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/yearn-min.json']}>
				<WithPopularTokens>
					<SafeProvider>
						<WithPrices>
							<DisperseContextApp>
								<WalletContextApp>
									<Component {...pageProps} />
								</WalletContextApp>
							</DisperseContextApp>
						</WithPrices>
					</SafeProvider>
				</WithPopularTokens>
			</WithMom>
		</WithFonts>
	);
}
