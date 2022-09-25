import {
	armWorkout,
	backWorkout,
	legWorkout,
	shoulderWorkout,
} from 'src/utils/predefined-workout'
import {trpc} from 'src/utils/trpc'

interface PredefinedWorkoutProps {
	type: string
	workoutId: string
}
const PredefinedExercises = ({type, workoutId}: PredefinedWorkoutProps) => {
	const createExercise = trpc.useMutation('exercise.createExercise')
	const utils = trpc.useContext()
	const onCreateExercise = async (name: string) => {
		try {
			const data = {
				name,
				workoutId,
			}
			const exercise = await createExercise.mutateAsync(data)
			if (exercise) {
				utils.invalidateQueries(['exercise.getExercises', {workoutId}])
			}
		} catch {}
	}
	return (
		<div className='flex flex-col gap-2'>
			<h1 className='text-center text-lg font-bold'>
				Suggested Exercises for {type}
			</h1>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				{type === 'Arms' &&
					armWorkout.exercises.map((exercise, i) => (
						<div key={i} className='rounded bg-slate-700 p-2 dark:bg-blue-900'>
							<p
								className='text-center font-bold text-white'
								onClick={() => onCreateExercise(exercise.name)}
							>
								{exercise.name}
							</p>
						</div>
					))}
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				{type === 'Legs' &&
					legWorkout.exercises.map((exercise, i) => (
						<div key={i} className='rounded bg-slate-700 p-2'>
							<h2
								className='text-red-white text-center hover:text-blue-400'
								onClick={() => onCreateExercise(exercise.name)}
							>
								{exercise.name}
							</h2>
						</div>
					))}
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				{type === 'Back' &&
					backWorkout.exercises.map((exercise, i) => (
						<div key={i} className='rounded bg-slate-700 p-2'>
							<h2
								className='text-center text-white hover:text-blue-400'
								onClick={() => onCreateExercise(exercise.name)}
							>
								{exercise.name}
							</h2>
						</div>
					))}
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				{type === 'Shoulder' &&
					shoulderWorkout.exercises.map((shoulder, i) => (
						<div key={i} className='rounded bg-slate-700 p-2'>
							<h2
								className='text-center text-white hover:text-blue-400'
								onClick={() => onCreateExercise(shoulder.name)}
							>
								{shoulder.name}
							</h2>
						</div>
					))}
			</div>
		</div>
	)
}

export default PredefinedExercises
