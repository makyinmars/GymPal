import {useRouter} from 'next/router'

import {trpc} from 'src/utils/trpc'

interface PredefinedWorkoutProps {
	userId: string
}

const PredefinedWorkout = ({userId}: PredefinedWorkoutProps) => {
	const predefinedWorkout = trpc.useMutation('workout.createPredefinedWorkout')
	const router = useRouter()
	const onPredefinedWorkout = async (type: string) => {
		const data = {
			userId: userId,
			name: type + ' Workout',
			description: 'This is a ' + type + ' workout',
			type: type,
		}
		const workout = await predefinedWorkout.mutateAsync(data)
		if (workout) {
			router.push(`/workout/${workout.id}`)
		}
	}
	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-center text-2xl font-bold'>
				Pick a predefined workout
			</h1>
			<div className='grid grid-cols-1 gap-4 rounded bg-slate-300 p-4 md:grid-cols-2'>
				<div className='rounded border border-slate-800 p-2'>
					<h2
						className='cursor-pointer text-center hover:text-blue-400'
						onClick={() => onPredefinedWorkout('Arms')}
					>
						Arms
					</h2>
				</div>
				<div className='rounded border border-slate-800 p-2'>
					<h2
						className='cursor-pointer text-center hover:text-blue-400'
						onClick={() => onPredefinedWorkout('Legs')}
					>
						Legs
					</h2>
				</div>
				<div className='rounded border border-slate-800 p-2'>
					<h2
						className='cursor-pointer text-center hover:text-blue-400'
						onClick={() => onPredefinedWorkout('Back')}
					>
						Back
					</h2>
				</div>
				<div className='rounded border border-slate-800 p-2'>
					<h2
						className='cursor-pointer text-center hover:text-blue-400'
						onClick={() => onPredefinedWorkout('Cardio')}
					>
						Cardio
					</h2>
				</div>
			</div>
		</div>
	)
}

export default PredefinedWorkout
