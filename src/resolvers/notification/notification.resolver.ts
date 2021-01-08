import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { NotificationService, Notification } from './index';
import { AddNotificationInput } from './inputs';
import { Activity, ActivityService } from '../activity';
import { User as UserType, UserService } from '../user';
import { UpdateManyResponse } from '../shared';
import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';

@Resolver(of => Notification)
export class NotificationResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => UserType, {
		description: 'Fetch the User who send the notification'
	})
	sender(@Root() notification: Notification) {
		return UserService.user({
			userId: notification.senderUserId,
			options: {
				throwError: false
			}
		});
	}

	@FieldResolver(type => UserType, {
		description: 'Fetch the User who receives the notification'
	})
	receiver(@Root() notification: Notification) {
		return UserService.user({
			userId: notification.receiverUserId,
			options: {
				throwError: false
			}
		});
	}

	@FieldResolver(type => Activity, {
		description: 'Fetch the related public Activity of the Notification'
	})
	activity(@Root() notification: Notification) {
		return ActivityService.getPublicActivity(notification.activityId);
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
	notifications(@User() { userId }: CurrentUser) {
		return NotificationService.getNotifications(userId);
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(returns => Notification, {
		description: 'Add a notification for the receiver.'
	})
	addNotification(@Arg('data') data: AddNotificationInput, @User() { userId }: CurrentUser) {
		// userId is current user's ID. This will be used as the senderUserId.
		// The sender will always be the one who send the notification,
		// meaning its the one who's currently logged in
		const senderUserId = userId;
		return NotificationService.add(data, senderUserId);
	}

	@Authorized()
	@Mutation(returns => Notification, {
		description: "Set current user's notification as read"
	})
	setNotificationAsRead(@Arg('notificationId', type => Int) notificationId: number, @User() { userId }: CurrentUser) {
		return NotificationService.setAsRead(notificationId, userId);
	}

	@Authorized()
	@Mutation(returns => UpdateManyResponse, {
		description: "Set all current user's notifications as read"
	})
	async setAllNotificationAsRead(@User() { userId }: CurrentUser) {
		return NotificationService.setAllAsRead(userId);
	}

	/*
	 * End Mutations
	 */
}
