import {createProtectedRouter} from './context'
import {z} from 'zod'

export const setRouter = createProtectedRouter()
	.query('getSetById', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.findUnique({where: {id: input.id}})
		},
	})
	.query('getSetsByExerciseId', {
		input: z.object({
			exerciseId: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.findMany({
				where: {
					exerciseId: input.exerciseId,
				},
			})
		},
	})
	.mutation('createSet', {
		input: z.object({
			exerciseId: z.string(),
			weight: z.number(),
			reps: z.number(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.create({
				data: {
					exerciseId: input.exerciseId,
					weight: input.weight,
					reps: input.reps,
				},
			})
		},
	})
	.mutation('createSets', {
		input: z.object({
			exerciseId: z.string(),
			sets: z.array(
				z.object({
					weight: z.number(),
					reps: z.number(),
				})
			),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.createMany({
				data: input.sets.map((set) => ({
					exerciseId: input.exerciseId,
					weight: set.weight,
					reps: set.reps,
				})),
			})
		},
	})
	.mutation('updateSet', {
		input: z.object({
			id: z.string(),
			weight: z.number(),
			reps: z.number(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.update({
				where: {
					id: input.id,
				},
				data: {
					weight: input.weight,
					reps: input.reps,
				},
			})
		},
	})
	.mutation('updateSets', {
		input: z.object({
			sets: z.array(
				z.object({
					id: z.string(),
					weight: z.number(),
					reps: z.number(),
				})
			),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.updateMany({
				data: input.sets.map((set) => ({
					weight: set.weight,
					reps: set.reps,
				})),
				where: {
					id: {
						in: input.sets.map((set) => set.id),
					},
				},
			})
		},
	})
	.mutation('deleteSet', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.set.delete({
				where: {
					id: input.id,
				},
			})
		},
	})
