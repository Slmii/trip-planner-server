import { AuthenticationError, UserInputError, ForbiddenError, ApolloError } from 'apollo-server';

export const errors = {
	// Auth
	invalidClientCredentials: new AuthenticationError('Invalid Client Credentials'),
	invalidSignInCredentials: new UserInputError('Invalid Sign In Credentials'),
	invalidSession: new AuthenticationError('Invalid Login Session'),
	inactiveAccount: new ForbiddenError('Account is not yet activated'),
	lockedAccount: new ForbiddenError('Account is locked'),
	// Permissions
	notAuthorized: new ForbiddenError('Not Authorized to use this endpoint'),
	// Invalid Data
	notFound: new Error('Resource not found'),
	invalidChangePasswordToken: new ApolloError('Invalid Change Password Token', '422'),
	emailAddressExists: new UserInputError('Email address is already taken'),
	invalidValues: (args: Record<string, string>) => new UserInputError('Invalid values', { invalidArgs: args })
};
