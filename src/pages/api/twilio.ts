import type {NextApiRequest, NextApiResponse} from 'next'
import {Twilio} from 'twilio'

import {env} from 'src/env/server.mjs'

const twilio = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		const {body} = req
		const twilioClient = new Twilio(
			env.TWILIO_ACCOUNT_SID,
			env.TWILIO_AUTH_TOKEN
		)
		const twilioMessage = await twilioClient.messages.create({
			body: body.message,
			from: env.TWILIO_PHONE_NUMBER,
			to: body.to,
		})
		res.status(200).json(twilioMessage)
	}
}

export default twilio
