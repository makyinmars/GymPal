import {trpc} from 'src/utils/trpc'

interface PredefinedWorkoutProps {
	userId: string
}

const PredefinedWorkout = ({userId}: PredefinedWorkoutProps) => {
	const predefinedWorkout = trpc.useMutation('workout.createPredefinedWorkout')
	const onPredefinedWorkout = async (type: string) => {
		const data = {
			userId: userId,
			name: type + ' Workout',
			description: 'This is a ' + type + ' workout',
			type: type,
		}
		const workout = await predefinedWorkout.mutateAsync(data)
	}
	return <div>PredefinedWorkout</div>
}

export default PredefinedWorkout
