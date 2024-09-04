import toast from 'react-hot-toast';
import {cl} from '@builtbymom/web3/utils';

import {IconCross} from '../icons/IconCross';
import {IconDone} from '../icons/IconDone';

export const succsessFileUploadToast = (): string =>
	toast.custom(t => (
		<div
			className={cl(
				t.visible ? 'animate-enter' : 'animate-leave',
				',/5 pointer-events-auto flex bg-success gap-2 items0center max-w-md rounded-lg text-primary px-6 py-4 shadow-lg'
			)}>
			<div className={'rounded-full bg-primary p-2'}>
				<IconDone className={'size-2'} />
			</div>
			<span className={'text-bold text-sm'}>{'Successfully uploaded!'}</span>
		</div>
	));

export const errorFileUploadToast = (): string =>
	toast.custom(t => (
		<div
			className={cl(
				t.visible ? 'animate-enter' : 'animate-leave',
				',/5 pointer-events-auto w-screen flex bg-fail gap-2 items-center absolute md:max-w-md rounded-lg text-primary px-6 py-4 shadow-lg'
			)}>
			<div className={'rounded-full bg-primary p-2'}>
				<IconCross className={'size-2 text-fail'} />
			</div>
			<div className={'flex flex-col'}>
				<span className={'text-sm font-bold'}>{'Upload Error'}</span>
				<span className={'text-sm'}>{'The file you are trying to upload seems to be broken'}</span>
			</div>
		</div>
	));
