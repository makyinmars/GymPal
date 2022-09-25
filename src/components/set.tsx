import {useForm, useFieldArray, SubmitHandler} from 'react-hook-form'

import {trpc} from 'src/utils/trpc'

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

const Set = ({exerciseId, workoutId}: SetProps) => {
	const {
		register,
		control,
		handleSubmit,
		formState: {errors},
	} = useForm<SetInputs>({
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

	const createSets = trpc.useMutation('set.createSets', {
		onSuccess() {
			utils.invalidateQueries(['set.getSetsByExerciseId', {exerciseId}])
		},
	})

	const {data, isError, isLoading} = trpc.useQuery([
		'set.getSetsByExerciseId',
		{exerciseId},
	])
	const onSubmit: SubmitHandler<SetInputs> = async (data) => {
		try {
			data.exerciseId = exerciseId
			data.workoutId = workoutId
			const sets = await createSets.mutateAsync(data)
			if (sets) {
				utils.invalidateQueries(['set.getSetsByExerciseId', {exerciseId}])
			}
		} catch {}
	}
	return (
		<div className='text-center'>
			{isLoading && <div>Loading...</div>}
			{isError && <div>Error</div>}
			{data &&
				data.map((set) => (
					<div key={set.id}>
						{set.weight} {set.reps}
					</div>
				))}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-4 rounded p-2 shadow-md shadow-slate-400'
			>
				{fields.map((field, index) => {
					return (
						<div
							key={field.id}
							className='grid grid-cols-2 items-center gap-2 rounded bg-slate-200 p-2'
						>
							<label className='text-center' htmlFor='weight'>
								Weight
							</label>
							<input
								id='weight'
								type='number'
								placeholder='0 lbs'
								{...register(`sets.${index}.weight` as const, {
									required: true,
									valueAsNumber: true,
								})}
								className='m-1 rounded border p-1'
							/>
							<label className='text-center' htmlFor='reps'>
								Reps
							</label>
							<input
								id='reps'
								type='number'
								placeholder='0 reps'
								{...register(`sets.${index}.reps` as const, {
									required: true,
									valueAsNumber: true,
								})}
								className='m-1 rounded border p-1'
							/>
							<div className='col-span-2 flex justify-center'>
								<button onClick={() => remove(index)} className='button'>
									Remove Set
								</button>
							</div>
						</div>
					)
				})}
				<div className='flex items-center justify-center gap-4 rounded bg-slate-300 py-2'>
					<div>
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
					</div>
					<div className='flex justify-center'>
						<button className='button'>Submit</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default Set
