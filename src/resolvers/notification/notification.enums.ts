import { registerEnumType } from 'type-graphql';

export enum NotificationType {
	ACTIVITY_INVITATION_SENT = 'ACTIVITY_INVITATION_SENT',
	ACTIVITY_JOIN_REQUEST = 'ACTIVITY_JOIN_REQUEST',
	UPCOMING_TRIP = 'UPCOMING_TRIP',
	UPCOMING_ACTIVITY = 'UPCOMING_ACTIVITY'
}

registerEnumType(NotificationType, {
	name: 'NotificationType',
	description: 'Type of the notification'
});
