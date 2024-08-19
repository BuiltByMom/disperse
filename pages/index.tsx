import type {ReactElement} from 'react';

import {ActionSection} from '@/components/ActionSection';
import {Recievers} from '@/components/common/Recievers';
import {Controls} from '@/components/Controls';
import {HeaderSection} from '@/components/HeaderSection';

export default function Home(): ReactElement | null {
	return (
		<div className={'flex min-h-screen flex-col items-center justify-start bg-background py-6'}>
			<HeaderSection />
			<div className={'max-w-[1200px]'}>
				<Controls />
				<Recievers />
				<ActionSection />
			</div>
		</div>
	);
}
