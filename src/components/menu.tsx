import {Fragment} from 'react'
import {Menu as Dropdown} from '@headlessui/react'
import Link from 'next/link'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillHome} from 'react-icons/ai'
import {CgGym} from 'react-icons/cg'
import {FiSettings} from 'react-icons/fi'

const links = [
	{href: '/login', label: 'Login', icon: <AiFillHome />},
	{href: '/workout', label: 'Workouts', icon: <CgGym />},
	{href: '/user', label: 'User Settings', icon: <FiSettings />},
]

const Menu = () => {
	return (
		<Dropdown>
			<Dropdown.Button className='flex items-center justify-center rounded border-2 border-white p-1'>
				<GiHamburgerMenu />
			</Dropdown.Button>
			<Dropdown.Items className='flex flex-col'>
				{links.map((link) => (
					<Dropdown.Item key={link.href} as={Fragment}>
						{({active}) => (
							<Link href={link.href}>
								<a className='flex items-center gap-1'>
									{link.icon}
									{link.label}
								</a>
							</Link>
						)}
					</Dropdown.Item>
				))}
			</Dropdown.Items>
		</Dropdown>
	)
}

export default Menu
