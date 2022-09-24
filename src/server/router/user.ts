import {createProtectedRouter} from './context'

import {z} from 'zod'

export const userRouter = createProtectedRouter()
	.query('getUserById', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.user.findUnique({where: {id: input.id}})
		},
	})
	.query('getUserByEmail', {
		input: z.object({
			email: z.string(),
		}),
		async resolve({ctx, input}) {
			return await ctx.prisma.user.findFirst({
				where: {
					email: input.email,
				},
			})
		},
	})
