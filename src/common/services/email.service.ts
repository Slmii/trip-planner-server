import nodemailer from 'nodemailer';

import config from '../../config';
import { Nodemailer } from '../types';

const send = async ({ email, subject, html }: Nodemailer) => {
	// Create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user: config.nodemailer.address,
			pass: config.nodemailer.password
		},
		tls: {
			secureProtocol: 'TLSv1_method'
		}
	});

	try {
		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: '"Dev__ Foo 👻" dev-foo@mail.com', // sender address
			to: email, // list of receivers
			subject, // Subject line
			html
		});

		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.log('nodemailer error', error);
	}
};

export const EmailService = {
	send
};
