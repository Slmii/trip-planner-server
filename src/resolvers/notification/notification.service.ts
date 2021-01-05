import { AddNotificationInput } from './inputs';
import { ActivityService } from '../activity';
import { UserService } from './../user';
import { helpers, prisma, errors } from './../../common/utils';

// senderUserId = who send the notification
// receiverUserId = who will receive the notification
export const add = async (data: AddNotificationInput, senderUserId: number) => {
	const { type, receiverUserId, activityId } = data;

	const user = await UserService.user({
		userId: receiverUserId,
		options: {
			throwError: false
		}
	});

	if (!user) {
		throw errors.notFound;
	}

	const activity = await ActivityService.getPublicActivity(activityId);

	if (!activity || !activity.public) {
		throw errors.notFound;
	}

	return prisma.notification.create({
		data: {
			type,
			receiverUserId,
			senderUserId,
			activityId: activity.id
		}
	});
};

export const getNotifications = (userId: number) => {
	return prisma.notification.findMany({
		where: {
			receiverUserId: userId
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
};

export const setAsRead = async (notificationId: number, userId: number) => {
	const notification = await prisma.notification.findUnique({
		where: {
			id: notificationId
		}
	});

	if (!notification || !helpers.isCreator(notificationId, userId)) {
		throw errors.notFound;
	}

	return prisma.notification.update({
		data: {
			read: true
		},
		where: {
			id: notification.id
		}
	});
};

export const setAllAsRead = (userId: number) => {
	return prisma.notification.updateMany({
		data: {
			read: true
		},
		where: {
			receiverUserId: userId
		}
	});
};
