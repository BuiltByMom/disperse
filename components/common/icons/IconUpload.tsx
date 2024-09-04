import React from 'react';

import type {ReactElement} from 'react';

export function IconUpload(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'20'}
			height={'24'}
			viewBox={'0 0 20 24'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<g id={'file-upload'}>
				<path
					id={'Stroke'}
					d={'M5.99951 17.002L9.99951 13.002L13.9995 17.002'}
					stroke={'white'}
					strokeWidth={'2'}
					strokeLinecap={'round'}
					strokeLinejoin={'round'}
				/>
				<path
					id={'Stroke_2'}
					d={'M10 13.002V23.002'}
					stroke={'white'}
					strokeWidth={'2'}
					strokeLinecap={'round'}
					strokeLinejoin={'round'}
				/>
				<path
					id={'Stroke_3'}
					d={
						'M6 23.002H3C1.896 23.002 1 22.106 1 21.002V3.00195C1 1.89795 1.896 1.00195 3 1.00195H12L19 8.00195V21.002C19 22.106 18.104 23.002 17 23.002H14'
					}
					stroke={'white'}
					strokeWidth={'2'}
					strokeLinecap={'round'}
					strokeLinejoin={'round'}
				/>
			</g>
		</svg>
	);
}
