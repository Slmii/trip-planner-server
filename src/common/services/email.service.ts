import nodemailer from 'nodemailer';

import { Nodemailer } from '../common/types';

export default {
	send: async ({ email, html }: Nodemailer) => {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			requireTLS: true,
			auth: {
				user: 'selami.corlido@gmail.com', // like : abc@gmail.com
				pass: 'corlidoTR92.' // like : pass@123
			}
		});

		try {
			// send mail with defined transport object
			const info = await transporter.sendMail({
				from: '"Dev__ Foo 👻" dev-foo@mail.com', // sender address
				to: email, // list of receivers
				subject: 'Reset password', // Subject line
				html
			});

			console.log('Message sent: %s', info.messageId);
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		} catch (error) {
			console.log('nodemailer error', error);
		}
	}
};
