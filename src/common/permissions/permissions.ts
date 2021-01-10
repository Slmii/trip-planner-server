import { ApolloError } from 'apollo-server';
import { allow, and, deny, shield } from 'graphql-shield';

import { addTripSchema, editUserSchema, signUpSchema } from '../../validations';
import { rules } from './rules';

export const permissions = shield(
	{
		Query: {
			'*': rules.isAuthenticated
		},
		Mutation: {
			signIn: allow,
			forgottenPassword: allow,
			changeForgottenPassword: allow,
			signOut: rules.isAuthenticated,
			signUp: rules.isInputValid(signUpSchema),
			editUser: and(rules.isAuthenticated, rules.isInputValid(editUserSchema)),
			addTrip: and(rules.isAuthenticated, rules.isAuthorized('USER'), rules.isInputValid(addTripSchema)),
			// fileUpload:
			'*': and(rules.isAuthenticated, rules.isAuthorized('USER'))
		}
	},
	{
		fallbackError: (error, _parent, _args, _context, _info) => {
			if (error instanceof ApolloError) {
				// expected errors
				console.log('Instance of ApolloError', error);
				return error;
			} else if (error instanceof Error) {
				// unexpected errors
				console.error('Instance of Error', error);
				return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER');
			} else {
				console.error('The resolver threw something that is not an error.');
				console.error(error);
				return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER');
			}
		},
		fallbackRule: deny
	}
);
