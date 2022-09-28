import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Head from 'next/head'
import Menu from 'src/components/menu'
import {trpc} from 'src/utils/trpc'
import Spinner from '../../components/spinner'

const ViewWorkouts = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const {data, isError, isLoading} = trpc.workout.getWorkouts.useQuery()

	const deleteWorkout = trpc.workout.deleteWorkout.useMutation()

	const onDeleteWorkout = async (id: string) => {
		try {
			await deleteWorkout.mutateAsync({id})
		} catch {}
	}

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
		<>
			<Head>
				<title>View Workouts</title>
			</Head>
			<Menu>
				<div className='container mx-auto flex flex-col gap-4 p-4'>
					<h1 className='text-center text-2xl font-bold'>View Workouts</h1>
					<div className='grid grid-cols-1 gap-4 rounded md:grid-cols-3'>
						{isLoading && (
							<div className='col-span-3 text-center'>
								<Spinner />
							</div>
						)}
						{isError && <div className='col-span-3 text-center'>Error</div>}
						{data && data.length >= 1 ? (
							data.map((workout, i) => (
								<div
									key={i}
									className='flex cursor-pointer flex-col gap-2 rounded bg-white p-1 dark:bg-slate-900'
								>
									<p
										className='bg-blue-800 text-center text-lg font-bold text-white dark:bg-blue-900'
										onClick={() => router.push(`/workout/${workout.id}`)}
									>
										{workout.name}
									</p>
									<p className='text-center'>{workout.description}</p>
									<div className='flex justify-center'>
										<button
											className='button'
											onClick={() => onDeleteWorkout(workout.id)}
										>
											Delete Workout
										</button>
									</div>
								</div>
							))
						) : (
							<div className='col-span-3 text-center'>No Workouts</div>
						)}
					</div>
				</div>
			</Menu>
		</>
	)
}

export default ViewWorkouts
