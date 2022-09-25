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
// import faker from 'faker';

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
	} = trpc.useQuery(['exercise.getExercises', {workoutId}])

	console.log(exercisesData)

	const totalWeight = exercisesData?.reduce((acc, exercise) => {
		const sets = exercise.sets.reduce((acc, set) => {
			return acc + set.weight
		}, 0)
		return acc + sets
	}, 0)

	// Create a function that returns an array of object with the exercise name as the key and the total weight as the value
	const exerciseWeight = exercisesData?.reduce((acc, exercise) => {
		const sets = exercise.sets.reduce((acc, set) => {
			return acc + set.weight
		}, 0)
		return [{...acc, [exercise.name]: sets}]
	}, {})

	console.log('exerciseWeight', exerciseWeight)

	// Create a function that returns all the names of the exercises
	const exerciseNames = exercisesData?.map((exercise) => exercise.name)

	const fake = []
	for (let i = 0; i < 50; i++) {
		fake[i] = 1 * 100
	}
	const data = {
		labels: exerciseNames,
		datasets: [
			{
				label: 'Dataset 1',
				data: fake,
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
			{
				label: 'Dataset 2',
				data: fake,
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	}

	return <Bar options={options} data={data} />
}

export default Chart
