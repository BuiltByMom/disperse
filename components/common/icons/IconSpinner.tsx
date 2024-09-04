import React from 'react';

import type {ReactElement} from 'react';

function IconSpinner(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'48'}
			height={'48'}
			viewBox={'0 0 48 48'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<circle
				cx={'24'}
				cy={'24'}
				r={'21'}
				stroke={'white'}
				strokeOpacity={'0.4'}
				strokeWidth={'3'}
			/>
			<path
				d={'M45 24C45 35.598 35.598 45 24 45C12.402 45 3 35.598 3 24C3 12.402 12.402 3 24 3'}
				stroke={'white'}
				strokeWidth={'3'}
				strokeLinecap={'round'}
			/>
		</svg>
	);
}

export {IconSpinner};
