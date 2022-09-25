import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import {Bar} from 'react-chartjs-2'

import {trpc} from 'src/utils/trpc'

interface ChartProps {
	workoutId: string
}

const Chart = ({workoutId}: ChartProps) => {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend
	)
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Chart.js Bar Chart',
			},
		},
	}

	const {
		data: exercisesData,
		isError: exercisesIsError,
		isLoading: exercisesIsLoading,
	} = trpc.useQuery([
		'exercise.getViewExercisesByWorkoutId',
		{workoutId: workoutId},
	])

	// Create a function that returns all the names of the exercises
	const exerciseNames = exercisesData?.map((exercise) => exercise.name)

	const totalWeight: any = []
	exercisesData?.forEach((exercise) => {
		let weightSum = 0
		exercise.sets.forEach((set) => {
			weightSum += set.weight
		})
		totalWeight.push(weightSum)
	})

	const totalReps: any = []
	exercisesData?.forEach((exercise) => {
		let repsSum = 0
		exercise.sets.forEach((set) => {
			repsSum += set.reps
		})
		totalReps.push(repsSum)
	})

	const data = {
		labels: exerciseNames,
		datasets: [
			{
				label: 'Repetitions',
				data: totalReps,
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
			{
				label: 'Weight',
				data: totalWeight,
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	}

	return <Bar options={options} data={data} />
}

export default Chart
