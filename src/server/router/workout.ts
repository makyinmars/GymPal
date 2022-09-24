import {createProtectedRouter} from './context'
import {z} from 'zod'
import {TRPCError} from '@trpc/server'

export const workoutRouter = createProtectedRouter()
	.query('getWorkoutById', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ctx, input}) {
			const workout = await ctx.prisma.workout.findUnique({
				where: {id: input.id},
			})
			if (workout) {
				return workout
			} else {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Workout not found',
				})
			}
		},
	})
	.query('getWorkouts', {
		input: z.object({
			userId: z.string(),
		}),
		resolve({ctx, input}) {
			const workouts = ctx.prisma.workout.findMany({
				where: {
					userId: input.userId,
				},
			})

			if (workouts) {
				return workouts
			} else {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Workouts not found',
				})
			}
		},
	})
	.mutation('createWorkout', {
		input: z.object({
			userId: z.string(),
			name: z.string(),
			description: z.string(),
		}),
		resolve({ctx, input}) {
			const newWorkout = ctx.prisma.workout.create({
				data: {
					userId: input.userId,
					name: input.name,
					description: input.description,
				},
			})

			if (newWorkout) {
				return newWorkout
			} else {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Workout not created',
				})
			}
		},
	})
	.mutation('updateWorkout', {
		input: z.object({
			id: z.string(),
			name: z.string(),
		}),
		resolve({ctx, input}) {
			const updatedWorkout = ctx.prisma.workout.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
				},
			})

			if (updatedWorkout) {
				return updatedWorkout
			} else {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Workout not updated',
				})
			}
		},
	})
	.mutation('deleteWorkout', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			const deletedWorkout = ctx.prisma.workout.delete({
				where: {
					id: input.id,
				},
			})

			if (deletedWorkout) {
				return deletedWorkout
			} else {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Workout not deleted',
				})
			}
		},
	})
