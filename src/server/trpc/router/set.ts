import {t, authedProcedure} from '../trpc'
import {z} from 'zod'

export const setRouter = t.router({
	getSetById: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(({ctx, input: {id}}) => {
			return ctx.prisma.set.findUnique({
				where: {
					id,
				},
			})
		}),
	getSetsByExerciseId: authedProcedure
		.input(
			z.object({
				exerciseId: z.string(),
			})
		)
		.query(({ctx, input: {exerciseId}}) => {
			return ctx.prisma.set.findMany({
				where: {
					exerciseId,
				},
			})
		}),
	createSet: authedProcedure
		.input(
			z.object({
				exerciseId: z.string(),
				weight: z.number(),
				reps: z.number(),
				workoutId: z.string(),
			})
		)
		.mutation(({ctx, input: {exerciseId, weight, reps, workoutId}}) => {
			return ctx.prisma.set.create({
				data: {
					exerciseId,
					weight,
					reps,
					workoutId,
				},
			})
		}),

	createSets: authedProcedure
		.input(
			z.object({
				exerciseId: z.string(),
				workoutId: z.string(),
				sets: z.array(
					z.object({
						weight: z.number(),
						reps: z.number(),
					})
				),
			})
		)
		.mutation(({ctx, input: {exerciseId, workoutId, sets}}) => {
			return ctx.prisma.set.createMany({
				data: sets.map((set) => ({
					exerciseId,
					workoutId,
					weight: set.weight,
					reps: set.reps,
				})),
			})
		}),

	updateSet: authedProcedure
		.input(
			z.object({
				id: z.string(),
				weight: z.number(),
				reps: z.number(),
			})
		)
		.mutation(({ctx, input: {id, weight, reps}}) => {
			return ctx.prisma.set.update({
				where: {
					id,
				},
				data: {
					weight,
					reps,
				},
			})
		}),
	updateSets: authedProcedure
		.input(
			z.object({
				sets: z.array(
					z.object({
						id: z.string(),
						weight: z.number(),
						reps: z.number(),
					})
				),
			})
		)
		.mutation(({ctx, input: {sets}}) => {
			return ctx.prisma.set.updateMany({
				data: sets.map((set) => ({
					weight: set.weight,
					reps: set.reps,
				})),
				where: {
					id: {
						in: sets.map((set) => set.id),
					},
				},
			})
		}),

	deleteSetById: authedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(({ctx, input: {id}}) => {
			return ctx.prisma.set.delete({
				where: {
					id,
				},
			})
		}),
})
