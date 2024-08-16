import '@/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import type {AppProps} from 'next/app';
import {WalletContextApp} from '@builtbymom/web3/contexts/useWallet';
import {supportedNetworks} from '@/utils/tools.chains';
import {WithMom} from '@builtbymom/web3/contexts/WithMom';
import {ReceiversContextApp} from '@/components/common/contexts/useRecievers';
import {WithFonts} from '@/components/common/WithFonts';

export default function App({Component, pageProps}: AppProps) {
	return (
		<WithMom
			supportedChains={supportedNetworks}
			tokenLists={['https://raw.githubusercontent.com/SmolDapp/tokenLists/main/lists/yearn-min.json']}>
			<WithFonts>
				<WalletContextApp>
					<ReceiversContextApp>
						<Component {...pageProps} />
					</ReceiversContextApp>
				</WalletContextApp>
			</WithFonts>
		</WithMom>
	);
}
