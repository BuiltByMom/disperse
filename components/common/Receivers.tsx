import {type ReactElement} from 'react';
import {toAddress} from '@builtbymom/web3/utils';

import {DisperseStatus} from '../disperse/DisperseStatus';
import {AddReceiverCard} from './AddReceiverCard';
import {DownloadTemplateButton} from './DownloadTemplateButton';
import {ImportConfigurationButton} from './ImportConfigurationButton';
import {ReceiverCard} from './ReceiverCard';
import {useDisperse} from './contexts/useDisperse';
import {findDuplicatedAddresses} from './utils/helpers';

type TReceiversProps = {
	isUploadModalOpen: boolean;
	set_isUploadModalOpen: (value: boolean) => void;
};

export function Receivers({isUploadModalOpen, set_isUploadModalOpen}: TReceiversProps): ReactElement {
	const {configuration} = useDisperse();
	const duplicatedAddresses = findDuplicatedAddresses(configuration.inputs);

	return (
		<>
			<div className={'flex flex-col gap-6 px-6 md:grid md:grid-cols-3 md:px-0 lg:grid-cols-4'}>
				{configuration.inputs.length > 0 && (
					<>
						{configuration.inputs.map(input => (
							<ReceiverCard
								key={input.UUID}
								input={input}
								isDuplicated={duplicatedAddresses.has(toAddress(input.receiver.address))}
							/>
						))}
						<AddReceiverCard className={'!border-primary/10 bg-background-modal'} />
					</>
				)}
			</div>
			{configuration.inputs.length === 0 && (
				<div className={'flex flex-col items-center gap-10'}>
					<AddReceiverCard className={'!w-[282px]'} />
					<div className={'flex gap-2'}>
						<ImportConfigurationButton
							isUploadModalOpen={isUploadModalOpen}
							set_isUploadModalOpen={set_isUploadModalOpen}
							className={'transition-all hover:bg-primary/20'}
						/>
						<DownloadTemplateButton className={'transition-all hover:bg-primary/20'} />
					</div>
				</div>
			)}

			<DisperseStatus />
		</>
	);
}
