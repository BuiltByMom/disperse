
import type {ReactElement} from 'react';

import {ActionSection} from '@/components/ActionSection';
import {Receivers} from '@/components/common/Receivers';
import {Controls} from '@/components/Controls'; 
import {HeaderSection} from '@/components/HeaderSection';

export default function Home(): ReactElement {
	return ( 
		<div className={'flex min-h-screen flex-col items-center justify-start bg-background pt-6 md:py-6'}>
			<HeaderSection />
			<div className={'w-full md:max-w-[1200px] md:px-6'}>
				<Controls />
				<Receivers />
				<ActionSection />
			</div>
		</div> 
	);
}
