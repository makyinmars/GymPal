import {createProtectedRouter} from './context'
import {z} from 'zod'
import {Prisma} from '@prisma/client'

const defaultExerciseSelect = Prisma.validator<Prisma.ExerciseSelect>()({
	id: true,
	name: true,
	sets: true,
	workoutId: true,
	createdAt: true,
	updatedAt: true,
})

export const exerciseRouter = createProtectedRouter()
	.query('getExerciseById', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ctx, input}) {
			return await ctx.prisma.exercise.findUnique({where: {id: input.id}})
		},
	})
	.query('getExercises', {
		input: z.object({
			workoutId: z.string(),
		}),
		async resolve({ctx, input}) {
			return await ctx.prisma.exercise.findMany({
				where: {
					workoutId: input.workoutId,
				},
				select: defaultExerciseSelect,
			})
		},
	})
	.mutation('createExercise', {
		input: z.object({
			workoutId: z.string(),
			name: z.string(),
		}),
		async resolve({ctx, input}) {
			const exercise = await ctx.prisma.exercise.create({
				data: {
					workoutId: input.workoutId,
					name: input.name,
				},
			})

			return exercise
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
				},
			})
		},
	})
	.mutation('deleteExercise', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ctx, input}) {
			return await ctx.prisma.exercise.delete({
				where: {
					id: input.id,
				},
			})
		},
	})
