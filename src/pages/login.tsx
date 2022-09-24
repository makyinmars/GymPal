import Menu from '../components/menu'

const login = () => {
	return (
		<div className='bg-light container mx-auto p-4'>
			<h1 className='text-primary'>GymPal</h1>
			<div>
				<div className='bg-black'></div>
				<div>
					<span>Login</span>
				</div>
				<Menu />
			</div>
		</div>
	)
}

export default login
