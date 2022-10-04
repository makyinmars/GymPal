import {
	armWorkout,
	backWorkout,
	legWorkout,
	shoulderWorkout,
} from 'src/utils/predefined-workout'
import toast from 'react-hot-toast'
import {trpc} from 'src/utils/trpc'

interface PredefinedWorkoutProps {
	type: string
	workoutId: string
}
const PredefinedExercises = ({type, workoutId}: PredefinedWorkoutProps) => {
	return (
		<div className='flex flex-col gap-2'>
			<h1 className='text-center text-lg font-bold'>
				Suggested Exercises for {type}
			</h1>
			{type === 'Arms' && (
				<PredefinedExercise
					exercises={armWorkout.exercises}
					workoutId={workoutId}
				/>
			)}
			{type === 'Shoulder' && (
				<PredefinedExercise
					exercises={shoulderWorkout.exercises}
					workoutId={workoutId}
				/>
			)}
			{type === 'Leg' && (
				<PredefinedExercise
					exercises={legWorkout.exercises}
					workoutId={workoutId}
				/>
			)}
			{type === 'Back' && (
				<PredefinedExercise
					exercises={backWorkout.exercises}
					workoutId={workoutId}
				/>
			)}
		</div>
	)
}

export default PredefinedExercises

interface PredefinedExerciseProps {
	workoutId: string
	exercises: {
		name: string
	}[]
}

const PredefinedExercise = ({
	exercises,
	workoutId,
}: PredefinedExerciseProps) => {
	const utils = trpc.useContext()
	const createExercise = trpc.exercise.createExercise.useMutation({
		async onSuccess() {
			await utils.exercise.getExercises.invalidate()
		},
	})
	const onCreateExercise = async (name: string) => {
		try {
			const data = {
				name,
				workoutId,
			}
			const newExercise = await createExercise.mutateAsync(data)
			if (newExercise) {
				toast('New exercise created!', {
					duration: 2000,
					position: 'top-center',
					icon: '👏',
					iconTheme: {
						primary: '#000',
						secondary: '#fff',
					},
				})
			}
		} catch {}
	}
	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
			{exercises.map((exercise, i) => (
				<div key={i} className='rounded bg-slate-700 p-2 hover:bg-slate-500'>
					<h2
						className='cursor-pointer text-center text-slate-200 dark:text-slate-300'
						onClick={() => onCreateExercise(exercise.name)}
					>
						{exercise.name}
					</h2>
				</div>
			))}
		</div>
	)
}
