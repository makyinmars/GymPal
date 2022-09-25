interface LayoutProps {
	header: React.ReactNode
	children: React.ReactNode
	footer: React.ReactNode
}

const Layout = ({children, header, footer}: LayoutProps) => {
	return (
		<div className='flex h-screen flex-col gap-4 py-4'>
			{header}
			<div className='grow p-4'>
				{children}
				{footer}
			</div>
		</div>
	)
}

export default Layout
