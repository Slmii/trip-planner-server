import { PrismaClient, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { ValidationError } from 'class-validator';
import { GraphQLError } from 'graphql';

import config from '../../config';
import { CurrentUser, IRequest } from '../types';
import { IS_DEVELOPMENT } from './constants';

export const hasRole = (requiredRole: string, userRole: string) => {
	if (userRole === 'ADMIN') {
		return true;
	}

	return requiredRole === userRole;
};

export const hashPassword = async (password: string) => {
	const hashedPassword = await hash(password, config.saltFactor);
	return hashedPassword;
};

export const validatePassword = async (password: string, encryptedPassword: string = '') => {
	return await compare(password, encryptedPassword);
};

export const serializeValidationError = (errors: ValidationError[]) => {
	const serializedErrors: Record<string, string> = errors.reduce((accum, error) => {
		accum[error.property] = Object.values(error.constraints ?? {})[0];
		return accum;
	}, {} as Record<string, string>);

	return serializedErrors;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (err: GraphQLError): any => {
	if (IS_DEVELOPMENT) {
		return err;
	}

	if (err.extensions?.exception.validationErrors) {
		return {
			...err,
			extentions: {
				...err.extensions,
				validationErrors: serializeValidationError(err.extensions?.exception.validationErrors)
			}
		};
	}

	return err.message;
};

export const findUserByEmail = async (prisma: PrismaClient, email: string) => {
	const user = await prisma.user.findUnique({
		where: { email: email.toLowerCase() }
	});

	return user;
};

export const setCurrentUser = (req: IRequest, user: User) => {
	req.session.user = {
		userId: user.id,
		email: user.email,
		role: user.role
	};
};

export const getCurrentUser = (req: IRequest) => {
	return req.session.user;
};

export const hasUserRole = (user: CurrentUser | User) => {
	return user.role === 'USER';
};

export const hasAdminRole = (user: CurrentUser | User) => {
	return user.role === 'ADMIN';
};

export const isCreator = (value: number | string, valueToCompareWith: number | string) => value === valueToCompareWith;
