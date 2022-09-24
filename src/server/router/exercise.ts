import {createProtectedRouter} from './context'
import {z} from 'zod'

export const exerciseRouter = createProtectedRouter()
	.query('getExerciseById', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.exercise.findUnique({where: {id: input.id}})
		},
	})
	.query('getExercises', {
		input: z.object({
			workoutId: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.exercise.findMany({
				where: {
					workoutId: input.workoutId,
				},
			})
		},
	})
	.mutation('createExercise', {
		input: z.object({
			workoutId: z.string(),
			name: z.string(),
			description: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.exercise.create({
				data: {
					workoutId: input.workoutId,
					name: input.name,
					description: input.description,
				},
			})
		},
	})
	.mutation('updateExercise', {
		input: z.object({
			id: z.string(),
			name: z.string(),
			description: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.exercise.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
					description: input.description,
				},
			})
		},
	})
	.mutation('deleteExercise', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.exercise.delete({
				where: {
					id: input.id,
				},
			})
		},
	})
