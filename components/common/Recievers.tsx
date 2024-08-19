import {type ReactElement} from 'react';

import {AddReceiverCard} from './AddReceiverCard';
import {ReceiverCard} from './ReceiverCard';
import {useDisperse} from './contexts/useDisperse';

export function Recievers(): ReactElement {
	const {configuration} = useDisperse();
	return (
		<>
			<div className={'mt-[100px] grid grid-cols-4 gap-6'}>
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
			<div>{configuration.inputs.length === 0 && <AddReceiverCard />}</div>
		</>
	);
}
