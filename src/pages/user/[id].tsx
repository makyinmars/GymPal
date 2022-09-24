import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {trpc} from 'src/utils/trpc'

const UserId = () => {
	const {data: session} = useSession()
	const router = useRouter()
	const id = router.query.id as string

	const {data, isError, isLoading} = trpc.useQuery(['user.getUserById', {id}])
	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
		<div className='container mx-auto p-4'>
			<h1>User</h1>
			<div className=''>
				{isLoading && <div>Loading...</div>}
				{isError && <div>Error</div>}
				{data && (
					<div>
						<div className='text-2xl'>{data.name}</div>
						<div className='text-xl'>{data.email}</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default UserId
