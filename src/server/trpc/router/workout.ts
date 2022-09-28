import {t, authedProcedure} from '../trpc'
import {z} from 'zod'

export const workoutRouter = t.router({
	getViewWorkoutByWorkoutId: t.procedure
		.input(
			z.object({
				workoutId: z.string(),
			})
		)
		.query(({ctx, input}) => {
			return ctx.prisma.workout.findUnique({
				where: {
					id: input.workoutId,
				},
			})
		}),
	getWorkoutById: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(({ctx, input}) => {
			return ctx.prisma.workout.findUnique({
				where: {
					id: input.id,
				},
			})
		}),
	getWorkouts: authedProcedure.query(({ctx}) => {
		return ctx.prisma.workout.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		})
	}),

	createWorkout: authedProcedure
		.input(z.object({name: z.string(), description: z.string()}))
		.mutation(({ctx, input: {name, description}}) => {
			return ctx.prisma.workout.create({
				data: {
					name: name,
					description: description,
				},
			})
		}),
	updateWorkout: authedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				description: z.string(),
			})
		)
		.mutation(({ctx, input: {id, name, description}}) => {
			return ctx.prisma.workout.update({
				where: {
					id,
				},
				data: {
					name,
					description,
				},
			})
		}),
	deleteWorkout: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(({ctx, input: {id}}) => {
			return ctx.prisma.workout.delete({
				where: {
					id,
				},
			})
		}),

	createPredefinedWorkout: authedProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
				userId: z.string(),
				type: z.string(),
			})
		)
		.mutation(({ctx, input: {name, description, userId, type}}) => {
			return ctx.prisma.workout.create({
				data: {
					name,
					description,
					userId,
					type,
				},
			})
		}),
})
