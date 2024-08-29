import {Button} from './Button';
import {ModalWrapper} from './ModalWrapper';
import {IconFail} from './icons/IconFail';

import type {ReactElement} from 'react';

type TErrorModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
};

export function ErrorModal({isOpen, onClose}: TErrorModalProps): ReactElement {
	return (
		<ModalWrapper
			shouldHasHeader={false}
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'mt-24 flex flex-col items-center '}>
				<div
					className={
						'flex size-[104px] items-center justify-center rounded-[40px] border border-fail bg-fail/20'
					}>
					<IconFail />
				</div>
				<div className={'my-10 flex flex-col'}>
					<span className={'text-[32px] font-medium leading-[42px] text-primary'}>{'Not done'}</span>
					<p className={'mt-[10px] text-base font-medium text-primary'}>{'Oops text description'}</p>
				</div>
				<Button
					onClick={onClose}
					isBusy={false}
					className={'!bg-accent !text-secondary'}
					isDisabled={false}>
					<span>{'Try again'}</span>
				</Button>
			</div>
		</ModalWrapper>
	);
}
