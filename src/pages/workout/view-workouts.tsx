import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Head from 'next/head'
import Menu from 'src/components/menu'
import {trpc} from 'src/utils/trpc'

const ViewWorkouts = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const {data, isError, isLoading} = trpc.useQuery(['workout.getWorkouts'])

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
					<div className='grid grid-cols-3 gap-4 rounded bg-blue-300 p-4 dark:bg-slate-900'>
						{isLoading && (
							<div className='col-span-3 text-center'>Loading...</div>
						)}
						{isError && <div className='col-span-3 text-center'>Error</div>}
						{data ? (
							data.map((workout, i) => (
								<div
									key={i}
									className='flex cursor-pointer flex-col rounded bg-slate-700 p-1 text-white dark:bg-blue-900'
									onClick={() => router.push(`/workout/${workout.id}`)}
								>
									<p className='text-center text-lg font-bold'>
										{workout.name}
									</p>
									<p className='text-center'>{workout.description}</p>
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
