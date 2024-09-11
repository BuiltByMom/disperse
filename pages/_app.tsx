import {WalletContextApp} from '@builtbymom/web3/contexts/useWallet';
import {WithMom} from '@builtbymom/web3/contexts/WithMom';
import {SafeProvider} from '@gnosis.pm/safe-apps-react-sdk';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '@/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import {DisperseContextApp} from '@/components/common/contexts/useDisperse';
import {DisperseQueryManagement} from '@/components/common/contexts/useDisperseQuery';
import {WithPopularTokens} from '@/components/common/contexts/usePopularTokens';
import {WithPrices} from '@/components/common/contexts/usePrices';
import {Meta} from '@/components/common/Meta';
import {supportedNetworks} from '@/components/common/utils/tools.chains';
import {WithFonts} from '@/components/common/WithFonts';

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
								<DisperseQueryManagement>
									<WalletContextApp>
										<Component {...pageProps} />
									</WalletContextApp>
								</DisperseQueryManagement>
							</DisperseContextApp>
						</WithPrices>
					</SafeProvider>
				</WithPopularTokens>
			</WithMom>
		</WithFonts>
	);
}
