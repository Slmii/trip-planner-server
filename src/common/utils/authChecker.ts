import { Role } from '@prisma/client';
import { AuthChecker } from 'type-graphql';

import { Context } from '../types';
import { helpers } from './index';

export const authChecker: AuthChecker<Context> = ({ context: { req } }, roles) => {
	const user = helpers.getCurrentUser(req);
	const typedRoles = roles as Role[];

	// If `@Authorized()` without roles then check only is user exist
	if (!roles.length) {
		return user !== undefined;
	}

	// If no user, restrict access
	if (!user) {
		return false;
	}

	// If user doesnt have the required role(s)
	if (!typedRoles.includes(user.role)) {
		return false;
	}

	return true;
};
