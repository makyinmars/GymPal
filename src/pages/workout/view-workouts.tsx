import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

const ViewWorkouts = () => {
	const {data: session} = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-center'>View Workouts</h1>
		</div>
	)
}

export default ViewWorkouts
