import { errors, helpers, prisma } from '../../common/utils';
import { ActivityService } from '../activity';
import { AddNotificationInput } from '../notification/inputs';
import { PaginationInput } from '../shared/shared.inputs';
import { TripService } from '../trip';

/**
 * Add a notification linked to the receiver.
 * senderUserId is the userId of the current user (the one who is responsible
 * for the creation of the notification).
 * @param  {AddNotificationInput & { senderUserId }} data
 */
export const add = async (data: AddNotificationInput & { senderUserId: number }) => {
	const { type, senderUserId, receiverUserId, resourceId } = data;

	const isActivityNotification = helpers.isActivityNotification(type);
	const isTripNotification = helpers.isTripNotification(type);

	const notification = await prisma.notification.create({
		data: {
			type,
			receiverUserId,
			senderUserId,
			resourceId,
			read: false
		}
	});

	// Activity does not need to be private. Notification includes:
	// 1. request to join an activity
	// 2. invitation to join an activity
	// 3. upcoming activity
	if (isActivityNotification) {
		const activity = await ActivityService.getActivity(resourceId);

		if (!activity) {
			throw errors.notFound;
		}

		await prisma.notificationToActivities.create({
			data: {
				activityId: activity.id,
				notificationId: notification.id
			}
		});
	}

	// TODO: make sharing and managing Trips available in the future with multiple people
	// For now this notification only includes 'upcoming trip'
	if (isTripNotification) {
		const trip = await TripService.getTrip({
			id: resourceId
		});

		if (!trip) {
			throw errors.notFound;
		}

		await prisma.notificationToTrips.create({
			data: {
				tripId: trip.id,
				notificationId: notification.id
			}
		});
	}

	return notification;
};

/**
 * Get all current user notifications. `receiverUserId` is current
 * user who's logged in.
 * @param  { userId: number; pagination?: PaginationInput } params
 */
export const getNotifications = (params: { userId: number; read?: boolean; pagination?: PaginationInput }) => {
	const { userId, read, pagination } = params;

	return prisma.notification.findMany({
		where: {
			receiverUserId: userId,
			read
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: pagination?.take ?? 5,
		skip: pagination?.skip
	});
};

/**
 * Set current user's notification as read.
 * @param  {number} notificationId
 * @param  {number} userId
 */
export const setAsRead = async (notificationId: number, userId: number) => {
	const notification = await prisma.notification.findUnique({
		where: {
			id: notificationId
		}
	});

	if (!notification || !helpers.isCreator(notification.receiverUserId!, userId)) {
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

/**
 * Set all current user's notifications as read.
 * @param  {number} userId
 */
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

/**
 * Clear (delete) a user's notification.
 * @param  {number} notificationId
 * @param  {number} userId
 */
export const clear = async (notificationId: number, userId: number) => {
	const notification = await prisma.notification.findUnique({
		where: {
			id: notificationId
		}
	});

	if (notification?.receiverUserId !== userId) {
		throw errors.notFound;
	}

	await prisma.notificationToActivities.delete({
		where: {
			notificationId_activityId: {
				notificationId: notification.id,
				activityId: notification.resourceId
			}
		}
	});

	return prisma.notification.delete({
		where: {
			id: notification.id
		}
	});
};

/**
 * Clear (delete) all user's notifications.
 * @param  {number} userId
 */
export const clearAll = async (userId: number) => {
	await prisma.notificationToActivities.deleteMany({
		where: {
			notification: {
				receiverUserId: userId
			}
		}
	});

	return prisma.notification.deleteMany({
		where: {
			receiverUserId: userId
		}
	});
};
