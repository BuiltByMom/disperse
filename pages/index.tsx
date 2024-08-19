import type {ReactElement} from 'react';

import {Recievers} from '@/components/common/Recievers';
import {HeaderSection} from '@/components/HeaderSection';

export default function Home(): ReactElement {
	return (
		<div className={'flex h-screen flex-col items-center justify-start bg-background py-6'}>
			<HeaderSection />
			<Recievers />
		</div>
	);
}
