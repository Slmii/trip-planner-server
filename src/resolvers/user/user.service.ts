import { ApolloError } from 'apollo-server';
import { Response } from 'express';
import { v4 } from 'uuid';

import { Filters, IRequest, SignUpUser } from '../../common/types';
import { errors, helpers, prisma, redis } from '../../common/utils';
import config from '../../config';
import { EditUserInput, UserOrderByInput, UserWhereInput } from '../user/inputs';

export const UserService = {
	user: (userId: number) => {
		return prisma.user.findUnique({
			where: {
				id: userId
			}
		});
	},
	users: ({ where, pagination, orderBy }: Filters<UserWhereInput, UserOrderByInput>) => {
		return prisma.user.findMany({
			where: {
				email: {
					...where?.email,
					mode: 'insensitive'
				},
				firstName: {
					...where?.firstName,
					mode: 'insensitive'
				},
				lastName: {
					...where?.lastName,
					mode: 'insensitive'
				},
				status: {
					...where?.status
				},
				locked: {
					...where?.locked
				},
				role: {
					equals: where?.role
				},
				createdAt: {
					...where?.from,
					...where?.to
				}
			},
			orderBy,
			skip: pagination?.skip,
			take: pagination?.take
		});
	},
	add: async ({ email, firstName, lastName, password, status, locked, role, public: publicUser }: SignUpUser) => {
		const user = await UserService.findUserByEmail(email);

		if (user) {
			throw errors.emailAddressExists;
		}

		// TODO:
		// if has invitation token in URL, add data to table `UserToReceivedInvitations` after user has signed up (!important)
		// put a query string + token in the URL so the user will be redirected to the correct page after signup

		const newUser = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				firstName,
				lastName,
				password: await helpers.hashPassword(password),
				status,
				locked,
				role,
				public: publicUser
			}
		});

		return newUser;
	},
	edit: async (userId: number, data: EditUserInput | undefined) => {
		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) {
			throw errors.notFound;
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				email: data?.email?.toLowerCase(),
				firstName: data?.firstName,
				lastName: data?.lastName
			}
		});

		return updatedUser;
	},
	delete: (userId: number) => {
		return prisma.user.delete({
			where: {
				id: userId
			}
		});
	},
	editPassword: async (id: number, password: string) => {
		const user = await prisma.user.findUnique({
			where: {
				id
			}
		});

		if (!user) {
			throw errors.notFound;
		}

		const updatedUser = await prisma.user.update({
			where: {
				id
			},
			data: {
				password: await helpers.hashPassword(password)
			}
		});

		return updatedUser;
	},
	forgottenPassword: async (email: string) => {
		const user = await UserService.findUserByEmail(email);

		let token = '';

		if (user) {
			token = v4();
			await redis.set(token, user.id, 'ex', 3600); // 1 hour
		}

		return { user, token };
	},
	changeForgottenPassword: async (token: string, password: string) => {
		const redisUserId = await redis.get(token);

		if (!redisUserId) {
			throw errors.invalidChangePasswordToken;
		}

		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(redisUserId)
			}
		});

		if (!user) {
			throw errors.notFound;
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await helpers.hashPassword(password)
			}
		});

		return updatedUser;
	},
	signIn: async (email: string, password: string) => {
		const user = await UserService.findUserByEmail(email);
		const isPasswordValid = await helpers.validatePassword(password, user?.password);

		if (!user || (user && !isPasswordValid)) {
			throw errors.invalidSignInCredentials;
		}

		if (!user.status) {
			throw errors.inactiveAccount;
		}

		if (user.locked) {
			throw errors.lockedAccount;
		}

		return user;
	},
	signOut: (req: IRequest, res: Response): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				res.clearCookie(config.cookieName);

				if (err) {
					console.log('Sign Out Error', err);
					reject(new ApolloError(`Failed to SignOut: ${err}`));
					return false;
				}

				resolve(true);
			});
		});
	},
	findUserByEmail: (email: string) => {
		return prisma.user.findUnique({
			where: {
				email: email.toLowerCase()
			}
		});
	}
};
