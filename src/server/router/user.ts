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
	.query('getUser', {
		async resolve({ctx}) {
			return await ctx.prisma.user.findUnique({
				where: {
					email: ctx.session.user.email as string | undefined,
				},
			})
		},
	})
	.mutation('deleteUser', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ctx, input}) {
			return await ctx.prisma.user.delete({
				where: {
					id: input.id,
				},
			})
		},
	})
	.mutation('updateUser', {
		input: z.object({
			id: z.string(),
			name: z.string(),
			phoneNumber: z.string().optional(),
		}),
		async resolve({ctx, input}) {
			if (input.phoneNumber) {
				return await ctx.prisma.user.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						phoneNumber: input.phoneNumber,
					},
				})
			} else {
				return await ctx.prisma.user.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
					},
				})
			}
		},
	})
