import React from 'react'
import Card from './Card'
const WorkoutContainer = () => {
	return (
		<div className='flex flex-col gap-y-1'>
			<div className='grid grid-cols-2 gap-10 p-16'>
				<Card name='Arms' />
				<Card name='Legs' />
				<Card name='Chest' />
				<Card name='Cardio' />
			</div>

			<div className='mx-auto w-1/2'>
				<Card name='Custom' />
			</div>
		</div>
	)
}

export default WorkoutContainer
