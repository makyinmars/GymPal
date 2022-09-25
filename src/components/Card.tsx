interface CardProps {
	name: string
}
const Card = ({name}: CardProps) => {
	return (
		<div className='flex h-20 w-1/4 w-auto items-center justify-center rounded border border-solid'>
			<h1 className='text-6xl'>{name}</h1>
		</div>
	)
}

export default Card
