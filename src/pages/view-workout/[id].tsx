import Head from 'next/head'

import Menu from 'src/components/menu'
import {trpc} from 'src/utils/trpc'
import {useRouter} from 'next/router'

const ViewWorkout = () => {
	const router = useRouter()

	const workoutId = router.query.id as string

	const {data, isError, isLoading} =
		trpc.workout.getViewWorkoutByWorkoutId.useQuery({workoutId})

	const {
		data: exercisesData,
		isError: exercisesIsError,
		isLoading: exercisesIsLoading,
	} = trpc.exercise.getViewExercisesByWorkoutId.useQuery({workoutId})

	return (
		<>
			<Head>
				<title>{data && data.name}</title>
			</Head>
			<Menu>
				<div className='container mx-auto grid grid-cols-1 gap-4 p-4'>
					{isLoading && <div>Loading...</div>}
					{isError && <div>Error</div>}
					{data && (
						<div className='mx-auto'>
							<h2 className='text-center text-xl'>Workout: {data.name}</h2>
							<p className='text-center text-lg'>
								Description: {data.description}
							</p>
						</div>
					)}
					<div>
						<h2 className='pb-4 text-center text-2xl font-bold'>Exercises</h2>
						{exercisesIsLoading && <div>Loading...</div>}
						{exercisesIsError && <div>Error</div>}
						<div className='grid grid-cols-1 gap-4 rounded p-4 md:grid-cols-3 lg:grid-cols-4'>
							{exercisesIsLoading && (
								<div className='col-span-3 text-center'>Loading...</div>
							)}
							{exercisesIsError && (
								<div className='col-span-3 text-center'>Error</div>
							)}
							{exercisesData && exercisesData.length >= 1 ? (
								exercisesData.map((exercise, i) => (
									<div
										key={i}
										className='flex flex-col gap-4 rounded bg-slate-300 p-4 shadow-lg drop-shadow-lg dark:bg-slate-900'
									>
										<h3 className='text-center text-xl font-bold'>
											{exercise.name}
										</h3>

										<div className='grid grid-cols-2 place-items-center'>
											<h4>Reps</h4>
											<h4>Weight</h4>
										</div>
										{exercise.sets.map((set, i) => (
											<div
												key={i}
												className='grid grid-cols-2 place-items-center'
											>
												<p>{set.reps}</p>
												<p>{set.weight}</p>
											</div>
										))}
									</div>
								))
							) : (
								<div className='col-span-3 text-center'>No exercises</div>
							)}
						</div>
					</div>
				</div>
			</Menu>
		</>
	)
}

export default ViewWorkout
