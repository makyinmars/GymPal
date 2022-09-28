import {t, authedProcedure} from '../trpc'
import {z} from 'zod'

export const exerciseRouter = t.router({
	getViewExercisesByWorkoutId: t.procedure
		.input(
			z.object({
				workoutId: z.string(),
			})
		)
		.query(({ctx, input: {workoutId}}) => {
			return ctx.prisma.exercise.findMany({
				where: {
					workoutId,
				},
				include: {
					sets: true,
				},
			})
		}),

	getExerciseById: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(({ctx, input: {id}}) => {
			return ctx.prisma.exercise.findUnique({
				where: {
					id,
				},
			})
		}),

	getExercises: authedProcedure
		.input(z.object({workoutId: z.string()}))
		.query(({ctx, input: {workoutId}}) => {
			return ctx.prisma.exercise.findMany({
				where: {
					workoutId,
				},
				orderBy: {
					createdAt: 'desc',
				},

				include: {
					sets: true,
				},
			})
		}),

	createExercise: authedProcedure
		.input(
			z.object({
				name: z.string(),
				workoutId: z.string(),
			})
		)
		.mutation(({ctx, input: {name, workoutId}}) => {
			return ctx.prisma.exercise.create({
				data: {
					name,
					workoutId,
				},
			})
		}),

	updateExercise: authedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
			})
		)
		.mutation(({ctx, input: {id, name}}) => {
			return ctx.prisma.exercise.update({
				where: {
					id,
				},
				data: {
					name,
				},
			})
		}),

	deleteExercise: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(({ctx, input: {id}}) => {
			return ctx.prisma.exercise.delete({
				where: {
					id,
				},
			})
		}),
})
