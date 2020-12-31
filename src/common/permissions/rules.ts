import { rule } from 'graphql-shield';
import { ObjectSchema } from 'yup';
import { Role } from '@prisma/client';

import { errors, helpers } from '../../utils';
import { Context } from '../types';

export const rules = {
	isAuthenticated: rule({ cache: 'contextual' })((_parent, _args, { req }: Context) => {
		return helpers.getCurrentUser(req) ? true : errors.invalidSession;
	}),
	isAuthorized: (role: Role) => {
		return rule({ cache: 'contextual' })((_parent, _args, { req }: Context) => {
			const user = helpers.getCurrentUser(req);
			return helpers.hasRole(role, user.role) ? true : errors.notAuthorized;
		});
	},
	isInputValid: (schema: ObjectSchema) =>
		rule({ cache: 'strict' })(async (_parent, { data }, _context: Context) => {
			try {
				await schema.validate(data, { abortEarly: false });
				return true;
			} catch (error) {
				return errors.invalidValues(helpers.serializeValidationError(error));
			}
		})
};
