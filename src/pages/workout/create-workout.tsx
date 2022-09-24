import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {useForm, SubmitHandler} from 'react-hook-form'
import {trpc} from 'src/utils/trpc'

interface CreateWorkout {
	userId: string
	name: string
	description: string
}

const CreateWorkout = () => {
	const {data: session} = useSession()
	const router = useRouter()

	const userId = session?.user?.id as string

	const createWorkoutMutation = trpc.useMutation('workout.createWorkout')

	const {
		register,
		handleSubmit,
		watch,
		formState: {errors},
	} = useForm<CreateWorkout>()

	const onSubmit: SubmitHandler<CreateWorkout> = async (data) => {
		try {
			data.userId = userId
			const workout = await createWorkoutMutation.mutateAsync(data)
			console.log(workout)
		} catch {}
	}

	// useEffect(() => {
	// 	if (!session) {
	// 		router.push('/')
	// 	}
	// }, [router, session])
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-center'>Create Workout</h1>
			<form
				className='bg-slate-800 p-4 dark:bg-slate-200'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='mb-4'>
					<label className='mb-2 block text-sm font-bold' htmlFor='name'>
						Name
					</label>
					<input
						className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight shadow focus:outline-none'
						id='name'
						type='text'
						placeholder='Name'
						{...register('name', {required: true})}
					/>
					{errors.name && <span>This field is required</span>}
				</div>
				<div className='mb-4'>
					<label className='mb-2 block text-sm font-bold' htmlFor='description'>
						Description
					</label>
					<input
						className='focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight shadow focus:outline-none'
						id='description'
						type='text'
						placeholder='Description'
						{...register('description', {required: true})}
					/>
					{errors.description && <span>This field is required</span>}
				</div>

				<div className='flex justify-center'>
					<button
						className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
						type='submit'
					>
						Create
					</button>
				</div>
			</form>
		</div>
	)
}

export default CreateWorkout