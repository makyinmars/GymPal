// src/pages/_app.tsx
import type {Session} from 'next-auth'
import {SessionProvider} from 'next-auth/react'
import type {AppType} from 'next/app'
import {ThemeProvider} from 'next-themes'
import Head from 'next/head'
import '../styles/globals.css'
import {trpc} from '../utils/trpc'

const MyApp: AppType<{session: Session | null}> = ({
	Component,
	pageProps: {session, ...pageProps},
}) => {
	return (
		<>
			<Head>
				<title>App</title>
			</Head>
			<ThemeProvider attribute='class'>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</ThemeProvider>
		</>
	)
}

export default trpc.withTRPC(MyApp)
