import { AuthChecker } from 'type-graphql';

import { Context } from '../types';
import { helpers } from './index';

export const authChecker: AuthChecker<Context> = ({ context: { req } }, roles) => {
	const user = helpers.getCurrentUser(req);

	// If `@Authorized()` without roles then check only is user exist
	if (!roles.length) {
		return user !== undefined;
	}

	// If no user, restrict access
	if (!user) {
		return false;
	}

	// If user doesnt have the required role(s)
	if (!roles.includes(user.role)) {
		return false;
	}

	return true;
};
