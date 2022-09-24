import {Fragment} from 'react'
import {Menu as Dropdown, Transition} from '@headlessui/react'
import Link from 'next/link'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillHome} from 'react-icons/ai'
import {CgGym} from 'react-icons/cg'
import {FiSettings} from 'react-icons/fi'

interface MenuProps {
	children: React.ReactNode
}

const links = [
	{href: '/', label: 'Home', icon: <AiFillHome />},
	{href: '/workout', label: 'Workouts', icon: <CgGym />},
	{href: '/user', label: 'User Settings', icon: <FiSettings />},
]

const Menu = ({children}: MenuProps) => {
	return (
		<div className='container mx-auto p-4'>
			<Dropdown>
				<div>
					<Dropdown.Button className='flex items-center justify-center rounded border-2 border-white p-1'>
						<GiHamburgerMenu />
					</Dropdown.Button>
				</div>
				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'
				>
					<Dropdown.Items className='flex flex-col'>
						{links.map((link, i) => (
							<Dropdown.Item key={link.href} as={Fragment}>
								{({active}) => (
									<div>
										<Link href={link.href}>
											<a className='flex items-center gap-1'>
												{link.icon}
												{link.label}
											</a>
										</Link>
									</div>
								)}
							</Dropdown.Item>
						))}
					</Dropdown.Items>
				</Transition>
			</Dropdown>
			{children}
		</div>
	)
}

export default Menu
