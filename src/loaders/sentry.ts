import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Application } from 'express';

import config from '../config';

export default (app: Application) => {
	Sentry.init({
		dsn: config.sentryDsn,
		environment: process.env.NODE_ENV,
		attachStacktrace: true,
		maxValueLength: 1000,
		integrations: [
			// enable HTTP calls tracing
			new Sentry.Integrations.Http({ tracing: true }),
			// enable Express.js middleware tracing
			new Tracing.Integrations.Express({ app })
		],

		// We recommend adjusting this value in production, or using tracesSampler
		// for finer control
		tracesSampleRate: 1.0
	});
};
