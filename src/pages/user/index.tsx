import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Menu from 'src/components/menu'

import {getServerAuthSession} from 'src/server/common/get-server-auth-session'

const UserId = () => {
	const {data: session} = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])

	return (
		<Menu>
			<div className='container mx-auto p-4'>
				<h1>User</h1>
				<div className=''></div>
			</div>
		</Menu>
	)
}

export default UserId
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	return {
		props: {
			session: await getServerAuthSession(ctx),
		},
	}
}
