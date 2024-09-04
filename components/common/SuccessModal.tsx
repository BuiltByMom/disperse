import {Button} from './Button';
import {ModalWrapper} from './ModalWrapper';
import {useDisperse} from './contexts/useDisperse';
import {IconDone} from './icons/IconDone';

import type {ReactElement} from 'react';

type TSuccessModalProps = {
	isOpen: boolean;
	onClose: VoidFunction;
	totalToDisperse: string;
};

export function SuccessModal({isOpen, onClose, totalToDisperse}: TSuccessModalProps): ReactElement {
	const {configuration} = useDisperse();
	return (
		<ModalWrapper
			shouldHasHeader={false}
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'mt-24 flex flex-col items-center '}>
				<div
					className={
						'flex size-[104px] items-center justify-center rounded-[40px] border border-success bg-success/20'
					}>
					<IconDone />
				</div>
				<div className={'my-10 flex flex-col'}>
					<h2 className={'!font-bold leading-[42px]'}>{'Disperse done'}</h2>
					<p className={'mt-[10px] font-bold'}>
						{`Successfully dispersed ${totalToDisperse} to ${configuration.inputs.length} receivers`}
					</p>
				</div>
				<Button
					onClick={onClose}
					isBusy={false}
					className={'!bg-accent !text-secondary transition-all hover:bg-accent/90'}
					isDisabled={false}>
					<span>{'Cool'}</span>
				</Button>
			</div>
		</ModalWrapper>
	);
}
