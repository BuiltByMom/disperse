import type {ReactElement} from 'react';

export function IconSearch(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg
			{...props}
			width={'22'}
			height={'22'}
			viewBox={'0 0 22 22'}
			fill={'none'}
			xmlns={'http://www.w3.org/2000/svg'}>
			<path
				fillRule={'evenodd'}
				clipRule={'evenodd'}
				d={
					'M9 0C4.02972 0 0 4.02972 0 9C0 13.9703 4.02972 18 9 18C11.1249 18 13.0779 17.2635 14.6176 16.0318L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L16.0318 14.6176C17.2635 13.0779 18 11.1249 18 9C18 4.02972 13.9703 0 9 0ZM2 9C2 5.13428 5.13428 2 9 2C12.8657 2 16 5.13428 16 9C16 12.8657 12.8657 16 9 16C5.13428 16 2 12.8657 2 9Z'
				}
				fill={'currentcolor'}
				fillOpacity={'0.4'}
			/>
		</svg>
	);
}
