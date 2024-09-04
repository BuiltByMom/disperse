import {useRouter} from 'next/router';
import {useDeepCompareEffect} from '@react-hookz/web';

import {getPathWithoutQueryParams, serializeSearchStateForUrl} from '../utils/utils';

export function useSyncUrlParams(state: {[key: string]: unknown}, disabled?: boolean): void {
	const router = useRouter();

	useDeepCompareEffect(() => {
		if (!disabled) { 
			router.replace(
				{
					pathname: getPathWithoutQueryParams(router.asPath),
					query: serializeSearchStateForUrl(state)
				},
				undefined,
				{
					scroll: false,
					shallow: true
				}
			);
		}
	}, [state, disabled]);
}
