import * as Sentry from '@sentry/node';
import { MiddlewareFn } from 'type-graphql';

import { helpers } from '../../common/utils';
import Logger from '../../loaders/logger';
import { Context } from '../types';

export const ErrorInterceptor: MiddlewareFn<Context> = async ({ context, info }, next) => {
	try {
		return await next();
	} catch (err) {
		const currentUser = helpers.getCurrentUser(context.req);

		Logger.error(err);
		console.log(err);

		// Add scoped report details and send to Sentry
		Sentry.withScope(async scope => {
			const { req } = context;

			const data = Sentry.Handlers.parseRequest(<any>{}, req);

			scope.addEventProcessor(event => {
				return Sentry.Handlers.parseRequest(event, req);
			});

			scope.setUser({
				email: currentUser?.email,
				id: currentUser?.userId.toString() || '',
				ip_address: req.ip,
				role: currentUser?.role
			});

			// Log extras
			err.validationErrors && scope.setExtra('invalidArgs', helpers.serializeValidationError(err.validationErrors));
			data.extra && scope.setExtras(data.extra);

			const d = new Date();
			const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
			const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
			const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);

			// Annotate whether failing operation was query/mutation/subscription
			scope.setTags({
				operation: info.operation.operation,
				operationName: info.fieldName,
				method: req.method,
				date: `${year}-${month}-${day}`
			});

			if (err.path) {
				// We can also add the path as breadcrumb
				scope.addBreadcrumb({
					category: 'query-path',
					message: err.path.join(' > '),
					level: Sentry.Severity.Debug
				});
			}

			Sentry.captureException(err);
		});

		throw err;
	}
};
