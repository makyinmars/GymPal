import type {NextApiRequest, NextApiResponse} from 'next'
import {getServerAuthSession} from 'src/server/common/get-server-auth-session'
import {Twilio} from 'twilio'

import {env} from 'src/env/server.mjs'

const twilio = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerAuthSession({req, res})
	if (session) {
		if (req.method === 'POST') {
			const {message, to} = req.body
			const twilioClient = new Twilio(
				env.TWILIO_ACCOUNT_SID,
				env.TWILIO_AUTH_TOKEN
			)
			const twilioMessage = await twilioClient.messages.create({
				body: message,
				from: env.TWILIO_PHONE_NUMBER,
				to: to,
			})
			res.status(200).json(twilioMessage)
		}
	} else {
		res.send({
			error:
				'You must be signed in to view the protected content on this page.',
		})
	}
}

export default twilio
