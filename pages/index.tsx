import type {ReactElement} from 'react';

import {HeaderSection} from '@/components/HeaderSection';

export default function Home(): ReactElement {
	return (
		<div className={'flex h-screen justify-center bg-background py-6'}>
			<HeaderSection />
		</div>
	);
}
