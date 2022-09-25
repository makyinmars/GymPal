interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({children}: LayoutProps) => {
	return (
		<div className='flex h-screen flex-col py-4'>
			<h1>Header</h1>
			<div className='grow bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 p-4 text-slate-700'>
				BOOM
			</div>
			<footer>footer</footer>
		</div>
	)
}

export default Layout
