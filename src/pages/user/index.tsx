import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {getServerAuthSession} from 'src/server/common/get-server-auth-session'
import Menu from 'src/components/menu'

import {trpc} from 'src/utils/trpc'
import Head from 'next/head'
const UserId = () => {
	const {data: session} = useSession()
	const router = useRouter()

	console.log(session)
	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])

	return (
		<>
			<Head>
				<title>Settings</title>
			</Head>
			<Menu>
				<div className='container mx-auto p-4'>
					<h1>User</h1>
					<div className=''></div>
				</div>
			</Menu>
		</>
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
