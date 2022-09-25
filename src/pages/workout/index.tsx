import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Link from 'next/link'
import Head from 'next/head'
import {getServerAuthSession} from 'src/server/common/get-server-auth-session'
import Menu from 'src/components/menu'

const Workout = () => {
	const {data: session} = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
		<>
			<Head>
				<title>Workout</title>
			</Head>
			<Menu>
				<div className='container mx-auto flex flex-col gap-4 p-4'>
					<h1 className='text-center text-3xl font-bold'>Gym Pal</h1>
					<div className='flex justify-center'>
						<div className='grid grid-cols-1 justify-center gap-4 rounded-md bg-blue-300 p-4 dark:bg-slate-900 md:w-3/6 md:grid-cols-2'>
							<Link href='/workout/create-workout'>
								<a className='button flex items-center justify-center rounded-md bg-slate-700 text-lg font-bold dark:bg-blue-900 dark:text-white'>
									Create Workout
								</a>
							</Link>
							<Link href='/workout/view-workouts'>
								<a className='button flex items-center justify-center rounded-md bg-slate-700 text-lg font-bold dark:bg-blue-900 dark:text-white'>
									View Workout
								</a>
							</Link>
						</div>
					</div>
				</div>
			</Menu>
		</>
	)
}

export default Workout

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	return {
		props: {
			session: await getServerAuthSession(ctx),
		},
	}
}
