import {createProtectedRouter, createRouter} from './context'
import {z} from 'zod'
import {TRPCError} from '@trpc/server'

export const workoutRouter = createRouter()
	.query('getViewWorkoutByWorkoutId', {
		input: z.object({
			workoutId: z.string(),
		}),
		async resolve({ctx, input}) {
			return await ctx.prisma.workout.findUnique({
				where: {
					id: input.workoutId,
				},
			})
		},
	})
	.merge(
		createProtectedRouter()
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
				resolve({ctx}) {
					const userId = ctx.session.user.id
					// Get workouts by sorting by asc date and by userId
					const workouts = ctx.prisma.workout.findMany({
						where: {userId},
						orderBy: {createdAt: 'asc'},
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
			.mutation('createPredefinedWorkout', {
				input: z.object({
					userId: z.string(),
					name: z.string(),
					description: z.string(),
					type: z.string().optional(),
				}),
				async resolve({ctx, input}) {
					const newWorkout = await ctx.prisma.workout.create({
						data: {
							userId: input.userId,
							name: input.name,
							description: input.description,
							type: input.type,
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
	)
