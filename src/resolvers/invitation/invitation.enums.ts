import { registerEnumType } from 'type-graphql';

export enum InvitationStatus {
	PENDING = 'PENDING',
	ACCEPTED = 'ACCEPTED',
	REJETCED = 'REJECTED'
}

registerEnumType(InvitationStatus, {
	name: 'ActivityInvitationStatus',
	description: 'Status of the activity invitation'
});
