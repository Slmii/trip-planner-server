import { MiddlewareFn } from 'type-graphql';

import { Context } from '../types';

const LogAccessMiddleware: MiddlewareFn<Context> = async ({ info, context }, next) => {
	console.log(
		`Logging access: ${context.req.session.user ? context.req.session.user.userId : context.req.ip} -> ${info.parentType.name}.${
			info.fieldName
		}`
	);
	return next();
};

export default LogAccessMiddleware;
