import {authedProcedure, t} from '../trpc'

// Example router with queries that can only be hit if the user requesting is signed in
export const authRouter = t.router({
	getSession: t.procedure.query(({ctx}) => {
		return ctx.session
	}),
	getSecretMessage: authedProcedure.query(() => {
		return 'You are logged in and can see this secret message!'
	}),
})
