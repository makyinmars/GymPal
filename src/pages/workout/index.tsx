import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {getServerAuthSession} from 'src/server/common/get-server-auth-session'
import {trpc} from 'src/utils/trpc'

const Workout = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const userId = session?.user?.id as string
	const {data} = trpc.useQuery(['workout.getWorkouts', {userId}])

	console.log(data)

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return <div>Workout</div>
}

export default Workout

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	return {
		props: {
			session: await getServerAuthSession(ctx),
		},
	}
}
