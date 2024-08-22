import {AddReceiverCard} from './AddReceiverCard';
import {DownloadTemplateButton} from './DownloadTemplateButton';
import {ImportConfigurationButton} from './ImportConfigurationButton';
import {ReceiverCard} from './ReceiverCard';
import {useDisperse} from './contexts/useDisperse';

import type {ReactElement} from 'react';

export function Recievers(): ReactElement {
	const {configuration} = useDisperse();

	return (
		<>
			<div className={'grid grid-cols-4 gap-6'}>
				{configuration.inputs.length > 0 && (
					<>
						{configuration.inputs.map(input => (
							<ReceiverCard
								input={input}
								key={input.UUID}
							/>
						))}
						<AddReceiverCard className={'!border-primary/10'} />
					</>
				)}
			</div>
			{configuration.inputs.length === 0 && (
				<div className={'flex flex-col items-center gap-10'}>
					<AddReceiverCard />
					<div className={'flex gap-2'}>
						<ImportConfigurationButton className={'hover:bg-primary/20'} />
						<DownloadTemplateButton className={'hover:bg-primary/20'} />
					</div>
				</div>
			)}
		</>
	);
}
