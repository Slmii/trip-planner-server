import { errors, helpers, prisma } from '../../common/utils';
import { ActivityService } from '../activity';
import { AddNotificationInput } from '../notification/inputs';
import { TripService } from '../trip';

/**
 * Add a notification linked to the receiver.
 * senderUserId is the userId of the current user.
 * @param  {AddNotificationInput & { senderUserId}} data
 */
export const add = async (data: AddNotificationInput & { senderUserId: number }) => {
	const { type, senderUserId, receiverUserId, resourceId } = data;

	const isActivity = helpers.isActivityNotification(type);
	const isTrip = helpers.isTripNotification(type);

	const notification = await prisma.notification.create({
		data: {
			type,
			receiverUserId,
			senderUserId,
			resourceId,
			read: false
		}
	});

	if (isActivity) {
		const activity = await ActivityService.getPublicActivity(resourceId);

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

	if (isTrip) {
		const trip = await TripService.getTrip({
			id: resourceId,
			public: true
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
 * @param  {number} userId
 */
export const getNotifications = (userId: number) => {
	return prisma.notification.findMany({
		where: {
			receiverUserId: userId
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 5
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
