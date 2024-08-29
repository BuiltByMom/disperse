import React from 'react';

import type {ReactElement} from 'react';

export function IconFail(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'40'}
			height={'40'}
			viewBox={'0 0 40 40'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				d={'M34.7981 5.10278L5.09961 34.8013M34.7981 34.7981L5.09961 5.09961'}
				stroke={'#E53200'}
				strokeWidth={'9'}
				strokeLinecap={'round'}
			/>
		</svg>
	);
}
