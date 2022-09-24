import {createProtectedRouter} from './context'
import {z} from 'zod'

export const workoutRouter = createProtectedRouter()
	.query('getWorkoutById', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.workout.findUnique({where: {id: input.id}})
		},
	})
	.query('getWorkouts', {
		input: z.object({
			userId: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.workout.findMany({
				where: {
					userId: input.userId,
				},
			})
		},
	})
	.mutation('createWorkout', {
		input: z.object({
			userId: z.string(),
			name: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.workout.create({
				data: {
					userId: input.userId,
					name: input.name,
				},
			})
		},
	})
	.mutation('updateWorkout', {
		input: z.object({
			id: z.string(),
			name: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.workout.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
				},
			})
		},
	})
	.mutation('deleteWorkout', {
		input: z.object({
			id: z.string(),
		}),
		resolve({ctx, input}) {
			return ctx.prisma.workout.delete({
				where: {
					id: input.id,
				},
			})
		},
	})
