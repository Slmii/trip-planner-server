import { Invitation } from '@prisma/client';
import { nanoid } from 'nanoid';

import { errors, prisma } from '../../common/utils';
import { ActivityService } from '../activity';
import { AddInvitationInput } from '../invitation/inputs';

const add = async (data: { userId: number; activityId: number; email: string; maxPeople: number }) => {
	const { email, activityId, userId, maxPeople } = data;

	const invitations = await prisma.invitation.count({
		where: {
			activityId
		}
	});

	if (invitations >= maxPeople) {
		throw errors.activityInvitationLimitReaced;
	}

	const expiryDate = new Date();
	expiryDate.setHours(expiryDate.getHours() + 1);

	// TODO: add notification to receiver as 'activity join invitaion' (ACTIVITI_INVITATION_JOIN)

	return prisma.invitation.create({
		data: {
			email,
			token: nanoid(),
			expiresAt: expiryDate,
			activityId,
			sentInvitations: {
				create: {
					userId
				}
			}
		}
	});
};

/**
 * Add more than 1 invitation. Only available of the current user is the
 * creator of the activity and the activity is public. This does _not_ add
 * data to table `userToReceivedInvitations`. That will happen when the
 * user accepts the invitation.
 * @param  {Input.AddInvitationInput & { userId: number }} data
 */
const addMany = async (data: AddInvitationInput & { userId: number }) => {
	const { emails, activityId, userId } = data;

	const activity = await ActivityService.getUserActivity(activityId, userId);

	if (!activity || !activity.public) {
		throw errors.notFound;
	}

	// TODO:
	// add data to table `UserToReceivedInvitations` after user has signed up (!important)
	// put a query string + token in the URL so the user will be redirected to the correct page after signup
	// check if existing profile is public, only then can the user join (show an alert or something)

	const invitations: Invitation[] = [];

	for (const email of emails) {
		const invitation = await add({
			activityId,
			email,
			userId,
			maxPeople: activity.maxPeople ?? 0
		});

		if (invitation) {
			invitations.push(invitation);
		}
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
	// TODO: show in front-end that when a user has a private profile the user cannot join before making profile public
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

export const InvitationService = {
	addMany,
	getReceivedInvitations,
	getSentInvitations
};
