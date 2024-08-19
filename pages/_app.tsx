import {WalletContextApp} from '@builtbymom/web3/contexts/useWallet';
import {WithMom} from '@builtbymom/web3/contexts/WithMom';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '@/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import {DisperseContextApp} from '@/components/common/contexts/useDisperse';
import {WithFonts} from '@/components/common/WithFonts';
import {supportedNetworks} from '@/utils/tools.chains';

export default function App({Component, pageProps}: AppProps): ReactElement {
	return (
		<WithMom
			supportedChains={supportedNetworks}
			tokenLists={['https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/yearn-min.json']}>
			<WithFonts>
				<DisperseContextApp>
					<WalletContextApp>
						<Component {...pageProps} />
					</WalletContextApp>
				</DisperseContextApp>
			</WithFonts>
		</WithMom>
	);
}
