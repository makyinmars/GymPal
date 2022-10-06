import {Fragment} from 'react'
import {Menu as Dropdown, Transition} from '@headlessui/react'
import Link from 'next/link'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillHome} from 'react-icons/ai'
import {CgGym} from 'react-icons/cg'
import {FiSettings} from 'react-icons/fi'

import Theme from './theme'

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
			<div className='flex items-center justify-around'>
				<Dropdown>
					<div className='flex flex-col'>
						<div>
							<Dropdown.Button className='flex items-center justify-center rounded border-2 bg-black bg-opacity-20 p-1 hover:bg-opacity-30'>
								<GiHamburgerMenu className='icon' />
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
							<Dropdown.Items className='left-50 w-46 absolute top-12 mt-2 origin-top-left rounded-md bg-white shadow-lg'>
								{links.map((link, i) => (
									<Dropdown.Item key={i} as={Fragment}>
										<div>
											<Link href={link.href}>
												<a className='flex items-center gap-1 rounded-md bg-white py-0.5 px-2 hover:bg-gray-300 dark:text-black'>
													{link.icon}
													{link.label}
												</a>
											</Link>
										</div>
									</Dropdown.Item>
								))}
							</Dropdown.Items>
						</Transition>
					</div>
				</Dropdown>
				<Theme />
			</div>
			{children}
		</div>
	)
}

export default Menu
