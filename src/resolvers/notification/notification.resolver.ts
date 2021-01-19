import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { prisma } from '../../common/utils';
import { Activity } from '../activity';
import { Notification, NotificationService } from '../notification';
import { ManyResponse, PaginationInput } from '../shared';
import { User as UserType, UserService } from '../user';

@Resolver(of => Notification)
export class NotificationResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => UserType, {
		description: 'Fetch the user who send the notification'
	})
	sender(@Root() notification: Notification) {
		return UserService.user(notification.senderUserId);
	}

	@FieldResolver(type => Activity, {
		description: 'Fetch the related public activity of the notification'
	})
	async activity(@Root() notification: Notification) {
		const notificationToTrip = await prisma.notificationToActivities.findUnique({
			where: {
				notificationId_activityId: {
					notificationId: notification.id,
					activityId: notification.resourceId
				}
			},
			include: {
				activity: true
			}
		});

		return notificationToTrip?.activity;
	}

	@FieldResolver(type => Activity, {
		description: 'Fetch the related public trip of the notification'
	})
	async trip(@Root() notification: Notification) {
		const notificationToTrip = await prisma.notificationToTrips.findUnique({
			where: {
				notificationId_tripId: {
					notificationId: notification.id,
					tripId: notification.resourceId
				}
			},
			include: {
				trip: true
			}
		});

		return notificationToTrip?.trip;
	}

	/*
	 * End Field Resolvers
	 */

	/*
	 * Queries
	 */

	@Authorized()
	@Query(returns => [Notification], {
		description: "Fetch current user's notifictaions"
	})
	notifications(
		@Arg('read', { nullable: true }) read: boolean,
		@Arg('pagination', { nullable: true }) pagination: PaginationInput,
		@User() { userId }: CurrentUser
	) {
		return NotificationService.getNotifications({ userId, read, pagination });
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(returns => Notification, {
		description: "Set current user's notification as read"
	})
	setNotificationAsRead(@Arg('notificationId', type => Int) notificationId: number, @User() { userId }: CurrentUser) {
		return NotificationService.setAsRead(notificationId, userId);
	}

	@Authorized()
	@Mutation(returns => ManyResponse, {
		description: "Set all current user's notifications as read"
	})
	setAllNotificationAsRead(@User() { userId }: CurrentUser) {
		return NotificationService.setAllAsRead(userId);
	}

	@Authorized()
	@Mutation(returns => Notification, {
		description: "Clear (delete) user's notification"
	})
	clearNotification(@Arg('notificationId', type => Int) notificationId: number, @User() { userId }: CurrentUser) {
		return NotificationService.clear(notificationId, userId);
	}

	@Authorized()
	@Mutation(returns => ManyResponse, {
		description: "Clear (delete) all user's notifications"
	})
	clearAllNotifications(@User() { userId }: CurrentUser) {
		return NotificationService.clearAll(userId);
	}

	/*
	 * End Mutations
	 */
}
