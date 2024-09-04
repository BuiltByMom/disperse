import React from 'react';

import type {ReactElement} from 'react';

export function IconDone(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'44'}
			height={'35'}
			viewBox={'0 0 44 35'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				d={'M4 16L19 31L40 4'}
				stroke={'#00A66F'}
				strokeWidth={'8'}
				strokeLinecap={'round'}
				strokeLinejoin={'round'}
			/>
		</svg>
	);
}
