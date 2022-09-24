import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import Menu from 'src/components/menu'

import {trpc} from 'src/utils/trpc'

interface CreateExercise {
	workoutId: string
	name: string
}

const WorkoutId = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const utils = trpc.useContext()

	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<CreateExercise>()

	const id = router.query.id as string

	const {data, isError, isLoading} = trpc.useQuery([
		'workout.getWorkoutById',
		{id},
	])

	const {
		data: exercisesData,
		isError: exercisesIsError,
		isLoading: exercisesIsLoading,
	} = trpc.useQuery(['exercise.getExercises', {workoutId: id}])

	const createExercise = trpc.useMutation('exercise.createExercise', {
		onSuccess() {
			utils.fetchQuery(['exercise.getExercises', {workoutId: id}])
		},
	})

	const onSubmit: SubmitHandler<CreateExercise> = async (data) => {
		try {
			data.workoutId = id
			await createExercise.mutateAsync(data)
		} catch {}
	}

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
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

				<form
					className='rounded bg-slate-500 p-4 dark:bg-slate-400'
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className='mb-4'>
						<label className='mb-2 block text-sm font-bold' htmlFor='name'>
							Name
						</label>
						<input
							className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight shadow focus:outline-none'
							id='name'
							type='text'
							placeholder='Name'
							{...register('name', {required: true})}
						/>
						{errors.name && <span>This field is required</span>}
					</div>

					<div className='flex justify-center'>
						<button
							className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
							type='submit'
						>
							Create
						</button>
					</div>
				</form>
				<div>
					<h2 className='text-center'>Exercises</h2>
					{exercisesIsLoading && <div>Loading...</div>}
					{exercisesIsError && <div>Error</div>}
					<div className='grid grid-cols-3 gap-4 rounded bg-slate-500 p-4'>
						{exercisesIsLoading && (
							<div className='col-span-3 text-center'>Loading...</div>
						)}
						{exercisesIsError && (
							<div className='col-span-3 text-center'>Error</div>
						)}
						{exercisesData ? (
							exercisesData.map((exercise, i) => (
								<div key={i} className='rounded bg-slate-300 p-4'>
									<h3 className='text-center text-xl font-bold'>
										{exercise.name}
									</h3>
								</div>
							))
						) : (
							<div className='col-span-3 text-center'>No exercises</div>
						)}
					</div>
				</div>
			</div>
		</Menu>
	)
}

export default WorkoutId
