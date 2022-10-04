import {useSession} from 'next-auth/react'
import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
import toast, {Toaster} from 'react-hot-toast'

import Spinner from 'src/components/spinner'
import Set from 'src/components/set'
import Menu from 'src/components/menu'
import PredefinedExercises from 'src/components/predefined-exercises'
import {trpc} from 'src/utils/trpc'
import {getServerAuthSession} from 'src/server/common/get-server-auth-session'

interface CreateExercise {
	workoutId: string
	name: string
}

const WorkoutId = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const id = router.query.id as string

	const utils = trpc.useContext()

	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<CreateExercise>()

	const {
		data: userData,
		isError: userIsError,
		isLoading: userIsLoading,
	} = trpc.user.getUser.useQuery()

	const workoutId = router.query.id as string

	const deleteExercise = trpc.exercise.deleteExercise.useMutation({
		async onSuccess() {
			await utils.exercise.getExercises.invalidate()
		},
	})

	const onDeleteExercise = async (id: string) => {
		try {
			await deleteExercise.mutateAsync({id})
		} catch {}
	}

	const {data, isError, isLoading} = trpc.workout.getWorkoutById.useQuery({id})

	const {
		data: exercisesData,
		isError: exercisesIsError,
		isLoading: exercisesIsLoading,
	} = trpc.exercise.getExercises.useQuery({workoutId})

	const createExercise = trpc.exercise.createExercise.useMutation({
		async onSuccess() {
			await utils.workout.getWorkoutById.invalidate()
			await utils.exercise.getExercises.invalidate()
		},
	})

	const onSubmit: SubmitHandler<CreateExercise> = async (data) => {
		try {
			data.workoutId = workoutId
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

	const onCompleteWorkout = async () => {
		if (userData && userData.phoneNumber) {
			try {
				const message = `Great job on your workout! You can view your workout at https://gym-pal.vercel.app/view-workout/${workoutId}`
				const to = `+1${userData.phoneNumber}`
				const data = {
					message,
					to,
				}
				const result = await fetch('/api/twilio', {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify(data),
				})

				if (result) {
					toast('Good work!, check your phone!', {
						duration: 2000,
						position: 'top-center',
						icon: '👏',
						iconTheme: {
							primary: '#000',
							secondary: '#fff',
						},
					})

					setTimeout(() => {
						router.push('/workout/view-workouts')
					}, 1000)
				}
			} catch (e) {
				console.log(e)
			}
		}
	}

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])

	return (
		<>
			<Head>
				<title>{data && data.name}</title>
			</Head>
			<Toaster />
			<Menu>
				<div className='container mx-auto grid grid-cols-1 gap-4 p-4'>
					{isLoading && <Spinner />}
					{isError && <div>Error</div>}
					{data && (
						<>
							<h2 className='text-center text-xl font-bold'>
								Workout: {data.name}
							</h2>
							<p className='text-center text-lg'>
								Description: {data.description}
							</p>
						</>
					)}
					<div className='rounded bg-slate-300 p-10 shadow drop-shadow-lg dark:bg-slate-900'>
						{data && data.type && (
							<PredefinedExercises type={data.type} workoutId={workoutId} />
						)}
					</div>

					<form
						className='rounded bg-slate-300 p-4 shadow drop-shadow-lg dark:bg-slate-900'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='mb-4 flex flex-col gap-2'>
							<input
								className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight shadow focus:outline-none'
								id='name'
								type='text'
								placeholder='Name'
								{...register('name', {required: 'The name field is required!'})}
							/>
							{errors.name && (
								<span className='error'>{errors.name.message}</span>
							)}
						</div>

						<div className='flex justify-center'>
							<button className='button' type='submit'>
								Create new exercise
							</button>
						</div>
					</form>
					<div>
						<h2 className='text-center text-2xl font-bold'>Exercises</h2>
						{exercisesIsLoading && <div>Loading...</div>}
						{exercisesIsError && <div>Error</div>}
						<div className='grid grid-cols-1 gap-4 rounded p-4 md:grid-cols-3'>
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
										<h3 className='text-center text-lg font-bold dark:text-white'>
											{exercise.name}
										</h3>
										<Set
											exerciseId={exercise.id}
											workoutId={exercise.workoutId}
											showForm={true}
										/>
										<div className='flex justify-center'>
											<button
												className='button'
												onClick={() => onDeleteExercise(exercise.id)}
											>
												Delete exercise
											</button>
										</div>
									</div>
								))
							) : (
								<div className='col-span-3 text-center'>No exercises</div>
							)}
						</div>

						{exercisesData && exercisesData.length >= 1 && (
							<div className='flex justify-center'>
								<button className='button' onClick={() => onCompleteWorkout()}>
									Complete workout
								</button>
							</div>
						)}
					</div>
				</div>
			</Menu>
		</>
	)
}

export default WorkoutId

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	return {
		props: {
			session: await getServerAuthSession(ctx),
		},
	}
}
