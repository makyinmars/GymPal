import {useForm, useFieldArray, SubmitHandler} from 'react-hook-form'
import {Dialog, Transition} from '@headlessui/react'
import toast from 'react-hot-toast'
import {Fragment, useState} from 'react'

import {trpc} from 'src/utils/trpc'
import {FcSupport} from 'react-icons/fc'

interface SetProps {
	exerciseId: string
	workoutId: string
}

interface SetInputs {
	exerciseId: string
	workoutId: string
	sets: {
		weight: number
		reps: number
	}[]
}

const EditSet = ({exerciseId, workoutId}: SetProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const {register, control, handleSubmit} = useForm<SetInputs>({
		defaultValues: {
			sets: [{weight: 0, reps: 0}],
		},
		mode: 'onBlur',
	})
	const utils = trpc.useContext()
	const {fields, append, remove} = useFieldArray({
		name: 'sets',
		control,
	})

	const createSets = trpc.set.createSets.useMutation({
		async onSuccess() {
			await utils.exercise.getExercises.invalidate()
		},
	})

	const onSubmit: SubmitHandler<SetInputs> = async (data) => {
		try {
			data.exerciseId = exerciseId
			data.workoutId = workoutId
			const newSets = await createSets.mutateAsync(data)
			if (newSets) {
				setIsOpen(false)
				toast('Exercise updated!', {
					duration: 2000,
					position: 'top-center',
					icon: '👏',
					iconTheme: {
						primary: '#000',
						secondary: '#fff',
					},
				})
			}
		} catch {}
	}

	return (
		<>
			<button
				className='button flex items-center justify-center gap-1'
				onClick={() => setIsOpen(true)}
			>
				<span>Edit exercise</span>
				<span>
					<FcSupport className='h-4 w-4' />
				</span>
			</button>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-10'
					onClose={() => setIsOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
									<Dialog.Title
										as='h3'
										className='text-center text-lg font-medium leading-6 text-gray-900'
									>
										Edit exercise
									</Dialog.Title>
									<div className='mt-2'>
										<form
											onSubmit={handleSubmit(onSubmit)}
											className='flex flex-col gap-4 rounded p-2'
										>
											{fields.map((field, index) => {
												return (
													<div
														key={field.id}
														className='grid grid-cols-2 items-center gap-2 rounded bg-slate-700 p-2'
													>
														<label
															htmlFor='weight'
															className='text-center text-white'
														>
															Weight
														</label>
														<input
															id='weight'
															type='number'
															min={1}
															placeholder='0 lbs'
															{...register(`sets.${index}.weight` as const, {
																required: true,
																valueAsNumber: true,
															})}
															className='m-1 rounded border p-1'
														/>
														<label
															htmlFor='reps'
															className='text-center text-white'
														>
															Reps
														</label>
														<input
															id='reps'
															type='number'
															min={1}
															placeholder='0 reps'
															{...register(`sets.${index}.reps` as const, {
																required: true,
																valueAsNumber: true,
															})}
															className='m-1 rounded border p-1'
														/>
														<div className='col-span-2 flex justify-center'>
															<button
																onClick={() => remove(index)}
																className='button hover:bg-blue-400'
															>
																Remove Set
															</button>
														</div>
													</div>
												)
											})}

											<div className='dark:blue-900 flex items-center justify-center gap-4 rounded py-2'>
												<button
													className='button'
													onClick={() =>
														append({
															weight: 0,
															reps: 0,
														})
													}
												>
													Add Set
												</button>
												<button className='button'>Save Sets</button>
											</div>
										</form>
									</div>

									<div className='mt-2 flex justify-center'>
										<button
											type='button'
											className='button'
											onClick={() => setIsOpen(false)}
										>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default EditSet
