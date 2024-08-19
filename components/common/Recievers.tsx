import {type ReactElement} from 'react';

import {AddReceiverCard} from './AddReceiverCard';
import {ReceiverCard} from './ReceiverCard';
import {useDisperse} from './contexts/useDisperse';
import {IconFile} from './icons/IconFile';
import {IconImport} from './icons/IconImport';

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
			<div className={'flex flex-col items-center gap-10'}>
				{configuration.inputs.length === 0 && <AddReceiverCard />}
				<div className={'flex gap-2'}>
					<button className={'bg-primary/10 text-primary flex items-center gap-2 rounded-lg p-2 font-bold'}>
						<IconImport />
						{'Import configuration'}
					</button>
					<button className={'bg-primary/10 text-primary flex items-center gap-2 rounded-lg p-2 font-bold'}>
						<IconFile />
						{'Download template'}
					</button>
				</div>
			</div>
		</>
	);
}
