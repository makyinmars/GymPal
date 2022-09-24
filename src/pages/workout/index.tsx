import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Link from 'next/link'

import {getServerAuthSession} from 'src/server/common/get-server-auth-session'

const Workout = () => {
	const {data: session} = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
		<div className='container mx-auto flex flex-col gap-4 p-4'>
			<h1 className='text-center text-2xl font-bold'>Workout</h1>
			<div className='mx-auto flex flex-col gap-4 rounded bg-slate-400 p-4'>
				<Link href='/workout/create-workout'>
					<a className='button'>Create Workout</a>
				</Link>
				<Link href='/workout/view-workouts'>
					<a className='button'>View Workouts</a>
				</Link>
			</div>
		</div>
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
