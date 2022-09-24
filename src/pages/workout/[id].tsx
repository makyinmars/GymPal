import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

const WorkoutId = () => {
	const {data: session} = useSession()
	const router = useRouter()

	useEffect(() => {
		if (!session) {
			router.push('/')
		}
	}, [router, session])
	return <div>WorkoutId</div>
}

export default WorkoutId
