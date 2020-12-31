import type { FileUpload } from 'graphql-upload';
import { Session } from 'express-session';
import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { Redis } from 'ioredis';

import config from '../config';
import { PaginationInput } from '../resolvers/shared';
import { TripSortByInput, TripWhereInput } from '../resolvers/trip/inputs';
import { UserOrderByInput, UserWhereInput } from '../resolvers/user/inputs';
import { createTripLoader } from '../resolvers/trip';
import { createLocationLoader } from '../resolvers/location';
import { createActivityLoader, createUsersToActivitiesLoader } from '../resolvers/activity';
import { createPreparationLoader } from '../resolvers/preparation';

/*
 *   GraphQL Context
 */
export interface Context {
	prisma: PrismaClient;
	req: IRequest;
	res: Response;
	redis: Redis;
	loaders: {
		trip: ReturnType<typeof createTripLoader>;
		location: ReturnType<typeof createLocationLoader>;
		activity: ReturnType<typeof createActivityLoader>;
		preparation: ReturnType<typeof createPreparationLoader>;
		usersToActivities: ReturnType<typeof createUsersToActivitiesLoader>;
	};
}

export interface IRequest extends Request {
	session: ISesssion;
}

interface ISesssion extends Session {
	user?: CurrentUser;
}

/*
 *   Services
 */
export interface SignUpUser {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	status?: boolean;
	locked?: boolean;
	role?: Role;
}

export interface EditUser {
	email?: string;
	firstName?: string;
	lastName?: string;
}

export interface ChangeForgottenPassword {
	token: string;
	password: string;
	confirmPassword: string;
}

export interface Nodemailer {
	email: string | string[];
	html: string;
}

export interface TripAddEdit {
	name: string;
	description?: string | null;
	public: boolean;
	dateFrom: string;
	dateTo: string;
	timezone: string;
	adults: number;
	children?: number | null;
	infants?: number | null;
}

/*
 *   Filters
 */
export interface Filters<W extends WhereInput, O extends OrderByInput> {
	where?: W;
	orderBy?: O;
	pagination?: PaginationInput;
}

type WhereInput = UserWhereInput | TripWhereInput;
type OrderByInput = UserOrderByInput | TripSortByInput;

/*
 *   Others
 */
export interface CurrentUser {
	userId: number;
	email: string;
	role: string;
}

export interface HandleErrorOptions {
	throwError?: boolean;
}

export type Config = typeof config;

export type File = Promise<FileUpload>;
