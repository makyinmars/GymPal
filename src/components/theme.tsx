import {useState, useEffect} from 'react'
import {useTheme} from 'next-themes'

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
		<div className='flex gap-4'>
			The current theme is: {theme}
			<button onClick={() => setTheme('light')}>Light Mode</button>
			<button onClick={() => setTheme('dark')}>Dark Mode</button>
		</div>
	)
}

export default Theme
