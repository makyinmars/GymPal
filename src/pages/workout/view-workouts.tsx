import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Head from 'next/head'
import toast, {Toaster} from 'react-hot-toast'

import Menu from 'src/components/menu'
import {trpc} from 'src/utils/trpc'
import Spinner from 'src/components/spinner'

const ViewWorkouts = () => {
	const {data: session} = useSession()
	const router = useRouter()
	const utils = trpc.useContext()

	const {data, isError, isLoading} = trpc.workout.getWorkouts.useQuery()

	const deleteWorkout = trpc.workout.deleteWorkout.useMutation({
		async onSuccess() {
			await utils.workout.getWorkouts.invalidate()
		},
	})

	const onDeleteWorkout = async (id: string) => {
		try {
			const deletedWorkout = await deleteWorkout.mutateAsync({id})
			if (deletedWorkout) {
				toast('Workout deleted!', {
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
			<Toaster />
			<Menu>
				<div className='container mx-auto flex flex-col gap-4 p-4'>
					<h1 className='text-center text-2xl font-bold text-slate-800 dark:text-slate-200'>
						View Workouts
					</h1>
					<div className='grid grid-cols-1 gap-4 rounded md:grid-cols-3 lg:grid-cols-4'>
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
									className='flex cursor-pointer flex-col gap-2 rounded bg-slate-100 p-2 shadow drop-shadow-lg dark:bg-slate-900'
								>
									<p
										className='bg-slate-300 text-center text-lg font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200'
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
