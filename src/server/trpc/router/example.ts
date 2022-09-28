import {t} from '../trpc'
import {z} from 'zod'

export const exampleRouter = t.router({
	hello: t.procedure.input(z.object({text: z.string()})).query(({input}) => {
		return {
			greeting: input.text,
			id: '123',
		}
	}),
})
