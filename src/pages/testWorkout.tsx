import WorkoutContainer from 'src/components/WorkoutContainer'
import Head from 'next/head'
const testWorkout = () => {
	return (
		<>
			<Head>
				<title>Test Workout</title>
			</Head>
			<div className='flex flex-col'>
				<div>
					<h1 className='text-center text-9xl'>Create Workout</h1>
				</div>

				<div className='text-center'>
					<WorkoutContainer />
				</div>
			</div>
		</>
	)
}

export default testWorkout
