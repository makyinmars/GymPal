import {GetServerSidePropsContext} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import Menu from 'src/components/menu'
import Head from 'next/head'
import Spinner from '../../components/spinner'

import {getServerAuthSession} from 'src/server/common/get-server-auth-session'
import {trpc} from 'src/utils/trpc'
import EditUser from 'src/components/edit-user'

const UserId = () => {
	const {data: session} = useSession()
	const router = useRouter()
	const utils = trpc.useContext()

	const {data, isLoading, isError} = trpc.useQuery(['user.getUser'])

	const deleteUser = trpc.useMutation('user.deleteUser')
	const updateUser = trpc.useMutation('user.updateUser')

	const onDeleteUser = async (id: string) => {
		try {
			const deletedUser = await deleteUser.mutateAsync({id})
			if (deletedUser) {
				router.push('/')
			}
		} catch {}
	}

	const onUpdateUser = async (id: string, name: string) => {
		try {
			const updatedUser = await updateUser.mutateAsync({id, name})
			if (updatedUser) {
				utils.invalidateQueries(['user.getUser'])
			}
		} catch {}
	}

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
				<div className='container mx-auto flex flex-col justify-center gap-4 p-4'>
					<h1 className='text-center font-bold'>User</h1>
					{isLoading && <Spinner />}
					{isError && <div>Error</div>}
					{data && (
						<div className='flex flex-col items-center justify-center gap-4'>
							<img
								src={data.image as string}
								alt='user'
								className='h-20 w-20 rounded-full'
							/>
							<p>{data.name}</p>
							<p>{data.email}</p>
							{data.phoneNumber && <p>{data.phoneNumber}</p>}
							<div className='flex flex-col items-center justify-center gap-4'>
								<EditUser userId={data.id} name={data.name as string} />
								<button
									className='button'
									onClick={() => onDeleteUser(data.id)}
								>
									Delete account
								</button>
							</div>
						</div>
					)}
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
