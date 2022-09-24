// src/server/router/index.ts
import {createRouter} from './context'
import superjson from 'superjson'

import {exampleRouter} from './example'
import {protectedExampleRouter} from './protected-example-router'
import {userRouter} from './user'
import {workoutRouter} from './workout'
import {setRouter} from './set'
import {exerciseRouter} from './exercise'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('example.', exampleRouter)
	.merge('auth.', protectedExampleRouter)
	.merge('user.', userRouter)
	.merge('workout.', workoutRouter)
	.merge('set.', setRouter)
	.merge('exercise.', exerciseRouter)

// export type definition of API
export type AppRouter = typeof appRouter
