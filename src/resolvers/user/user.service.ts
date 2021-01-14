import { ApolloError } from 'apollo-server';
import { Response } from 'express';
import { nanoid } from 'nanoid';

import { Filters, IRequest, SignUpUser } from '../../common/types';
import { errors, helpers, prisma, redis } from '../../common/utils';
import config from '../../config';
import { InvitationService } from '../invitation';
import { NotificationService, NotificationType } from '../notification';
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
	add: async ({ email, firstName, lastName, password, invitationToken }: SignUpUser) => {
		const user = await UserService.findUserByEmail(email);

		if (user) {
			throw errors.emailAddressExists;
		}

		const newUser = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				firstName,
				lastName,
				password: await helpers.hashPassword(password)
			}
		});

		// Add invitation and notification to the new user
		if (invitationToken) {
			const invitation = await InvitationService.validate(invitationToken);

			if (invitation) {
				// Add the invitation to the new user
				// so that it will be available in his 'received invitations' list
				await prisma.userToReceivedInvitations.create({
					data: {
						invitationId: invitation.id,
						userId: newUser.id
					}
				});

				// The user who sent the invitation
				const invitationSender = await prisma.userToSentInvitations.findFirst({
					where: {
						invitationId: invitation.id
					}
				});

				// Add a notification that the new user has received an invitation
				// from the sender
				if (invitationSender) {
					await NotificationService.add({
						receiverUserId: newUser.id,
						resourceId: invitation.activityId!,
						senderUserId: invitationSender.userId,
						type: NotificationType.ACTIVITY_INVITATION_SENT
					});
				}
			}
		}

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
			token = nanoid();
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
