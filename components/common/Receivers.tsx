import {AddReceiverCard} from './AddReceiverCard';
import {DownloadTemplateButton} from './DownloadTemplateButton';
import {ImportConfigurationButton} from './ImportConfigurationButton';
import {ReceiverCard} from './ReceiverCard';
import {useDisperse} from './contexts/useDisperse';

import type {ReactElement} from 'react';

export function Receivers(): ReactElement {
	const {configuration} = useDisperse();

	return (
		<>
			<div className={'flex flex-col gap-6 px-6 md:grid md:grid-cols-3 md:px-0 lg:grid-cols-4'}>
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
					<AddReceiverCard className={'!w-[282px]'} />
					<div className={'flex gap-2'}>
						<ImportConfigurationButton className={'hover:bg-primary/20'} />
						<DownloadTemplateButton className={'hover:bg-primary/20'} />
					</div>
				</div>
			)}
		</>
	);
}
