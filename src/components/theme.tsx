import {useState, useEffect} from 'react'
import {useTheme} from 'next-themes'
import {BsFillMoonFill, BsFillSunFill} from 'react-icons/bs'

const Theme = () => {
	const [mounted, setMounted] = useState(false)
	const {theme, setTheme} = useTheme()

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<div className='flex justify-center'>
			{theme === 'light' ? (
				<button onClick={() => setTheme('dark')}>
					<BsFillSunFill className='icon' />
				</button>
			) : (
				<button onClick={() => setTheme('light')}>
					<BsFillMoonFill className='icon' />
				</button>
			)}
		</div>
	)
}

export default Theme
