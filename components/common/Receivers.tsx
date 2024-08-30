import {type ReactElement} from 'react';
import {toAddress} from '@builtbymom/web3/utils';

import {AddReceiverCard} from './AddReceiverCard';
import {DisperseStatus} from './DisperseStatus';
import {DownloadTemplateButton} from './DownloadTemplateButton';
import {ImportConfigurationButton} from './ImportConfigurationButton';
import {ReceiverCard} from './ReceiverCard';
import {useDisperse} from './contexts/useDisperse';
import {findDuplicatedAddresses} from './utils/helpers';

export function Receivers(): ReactElement {
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
						<AddReceiverCard className={'!border-primary/10'} />
					</>
				)}
			</div>
			{configuration.inputs.length === 0 && (
				<div className={'flex flex-col items-center gap-10'}>
					<AddReceiverCard className={'!w-[282px]'} />
					<div className={'flex gap-2'}>
						<ImportConfigurationButton className={'transition-all hover:bg-primary/20'} />
						<DownloadTemplateButton className={'transition-all hover:bg-primary/20'} />
					</div>
				</div>
			)}

			<div className={'mx-6 mt-10 md:mx-0'}>
				<DisperseStatus />
			</div>
		</>
	);
}
