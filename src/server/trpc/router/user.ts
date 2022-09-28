import {authedProcedure, t} from '../trpc'

import {z} from 'zod'

export const userRouter = t.router({
	getUserById: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(({ctx, input}) => {
			return ctx.prisma.user.findUnique({
				where: {
					id: input.id,
				},
			})
		}),
	getUserByEmail: authedProcedure
		.input(
			z.object({
				email: z.string(),
			})
		)
		.query(({ctx, input}) => {
			return ctx.prisma.user.findUnique({
				where: {
					email: input.email,
				},
			})
		}),
	getUser: authedProcedure.query(({ctx}) => {
		if (ctx.session && ctx.session.user.email) {
			return ctx.prisma.user.findUnique({
				where: {
					email: ctx.session.user.email,
				},
			})
		}
	}),
	deleteUser: authedProcedure
		.input(z.object({id: z.string()}))
		.mutation(({ctx, input}) => {
			return ctx.prisma.user.delete({
				where: {
					id: input.id,
				},
			})
		}),

	updateUser: authedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				phoneNumber: z.string(),
			})
		)
		.mutation(({ctx, input}) => {
			return ctx.prisma.user.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
					phoneNumber: input.phoneNumber,
				},
			})
		}),
})
