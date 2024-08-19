import type {ReactElement} from 'react';

export function IconPlus(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'24'}
			height={'24'}
			viewBox={'0 0 24 24'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				fillRule={'evenodd'}
				clipRule={'evenodd'}
				d={'M12 24.0002C12.5523 24.0002 13 23.5524 13 23.0002L13 13.0002L23 13.0002C23.5523 13.0002 24 12.5524 24 12.0002C24 11.4479 23.5523 11.0002 23 11.0002L13 11.0002L13 1.00015C13 0.447867 12.5523 0.000151741 12 0.000151705C11.4477 0.000151652 11 0.447867 11 1.00015L11 11.0002L1 11.0002C0.447715 11.0002 -3.37364e-07 11.4479 -7.39462e-08 12.0002C1.57861e-07 12.5524 0.447716 13.0002 1 13.0002L11 13.0002L11 23.0002C11 23.5524 11.4477 24.0002 12 24.0002Z'}
				fill={'currentcolor'}
			/>
		</svg>
	);
}
