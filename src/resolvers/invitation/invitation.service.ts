import { Invitation } from '@prisma/client';
import { nanoid } from 'nanoid';

import { date, errors, prisma } from '../../common/utils';
import { ActivityService } from '../activity';
import { AddSingleInvitation } from '../invitation';
import { AddInvitationInput } from '../invitation/inputs';
import { NotificationService, NotificationType } from '../notification';
import { UserService } from '../user';

/**
 * Add an invitation.
 * @param  {AddSingleInvitation} data
 */
const add = async (data: AddSingleInvitation) => {
	const { email, activityId, receiverUserId, senderUserId } = data;

	const expiryDate = new Date();
	expiryDate.setHours(expiryDate.getHours() + 1);

	return prisma.invitation.create({
		data: {
			email,
			token: nanoid(),
			expiresAt: expiryDate,
			activityId,
			sentInvitations: {
				create: {
					userId: senderUserId
				}
			},
			// If user exists then also add to `userToReceivedInvitations`. If not then
			// that will happen when the invited user creates an account.
			receivedInvitations: {
				create: receiverUserId
					? {
							userId: receiverUserId
					  }
					: undefined
			}
		}
	});
};

/**
 * Add and send more than 1 invitation. Only available of the current user is the
 * creator of the activity. Invitations can be sent as long as the amount
 * of people that have joined does not exceed `maxPeople`
 * @param  {Input.AddInvitationInput & { userId: number }} data
 */
const addMany = async (data: AddInvitationInput & { userId: number }) => {
	const { emails, activityId, userId } = data;

	const senderUser = await UserService.user(userId);

	// ! Only users with a public profile are allowed to send out invitations
	if (!senderUser?.public) {
		throw errors.notAuthorized;
	}

	const activity = await ActivityService.getUserActivity(activityId, userId);

	if (!activity) {
		throw errors.notFound;
	}

	const users = await prisma.userToActivities.count({
		where: {
			activityId
		}
	});

	// If maximum allowed people has been reached
	if (users >= activity.maxPeople) {
		throw errors.activityJoinLimitReached;
	}

	const invitations: Invitation[] = [];

	for (const email of emails) {
		const receiverUser = await UserService.findUserByEmail(email);

		const invitation = await add({
			activityId,
			email,
			senderUserId: userId,
			receiverUserId: receiverUser?.id
		});

		// Add a notification if the received user has an existing account
		if (receiverUser) {
			await NotificationService.add({
				receiverUserId: receiverUser.id,
				resourceId: invitation.activityId!,
				senderUserId: userId,
				type: NotificationType.ACTIVITY_INVITATION_SENT
			});
		}

		invitations.push(invitation);
	}

	return invitations;
};

/**
 * Get all received invitations of the current user.
 * @param  {number} userId
 */
const getReceivedInvitations = async (userId: number) => {
	const userToReceivedInvitations = await prisma.userToReceivedInvitations.findMany({
		where: {
			userId
		},
		include: {
			invitation: true
		}
	});

	return userToReceivedInvitations.map(({ invitation }) => invitation);
};

/**
 * Get all sent invitations of the current user.
 * @param  {number} userId
 */
const getSentInvitations = async (userId: number) => {
	const userToSentInvitations = await prisma.userToSentInvitations.findMany({
		where: {
			userId
		},
		include: {
			invitation: true
		}
	});

	return userToSentInvitations.map(({ invitation }) => invitation);
};

/**
 * Validate the invitation token on null and expiry date.
 * @param  {string} token
 */
const validate = async (token: string) => {
	const invitation = await prisma.invitation.findFirst({
		where: {
			token
		}
	});

	if (!invitation) {
		throw errors.notFound;
	}

	if (date.isAfter(invitation.expiresAt)) {
		throw errors.expiredInvitation;
	}

	return invitation;
};

export const InvitationService = {
	addMany,
	getReceivedInvitations,
	getSentInvitations,
	validate
};
