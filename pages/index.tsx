import type {ReactElement} from 'react';

import {Recievers} from '@/components/common/Recievers';
import {Controls} from '@/components/Controls';
import {HeaderSection} from '@/components/HeaderSection';

export default function Home(): ReactElement | null {
	return (
		<div className={'flex h-screen flex-col items-center justify-start bg-background py-6'}>
			<HeaderSection />
			<Controls />
			<Recievers />
		</div>
	);
}
