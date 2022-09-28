import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Head from 'next/head'
import Menu from 'src/components/menu'
import {trpc} from 'src/utils/trpc'
import Spinner from '../../components/spinner'

const UserId = () => {
	const {data: session} = useSession()
	const router = useRouter()
	const id = router.query.id as string

	const {data, isError, isLoading} = trpc.user.getUserById.useQuery({id})
	useEffect(() => {
		if (!session) {
			router.push('/user')
		}
	}, [router, session])
	return (
		<>
			<Head>
				<title>id</title>
			</Head>
			<Menu>
				<div className='container mx-auto p-4'>
					<h1>User</h1>
					<div className=''>
						{isLoading && <Spinner />}
						{isError && <div>Error</div>}
						{data && (
							<div>
								<div className='text-2xl'>{data.name}</div>
								<div className='text-xl'>{data.email}</div>
							</div>
						)}
					</div>
				</div>
			</Menu>
		</>
	)
}

export default UserId
