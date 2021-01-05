import { Field, Int, ObjectType } from 'type-graphql';

import { Activity } from '../activity';
import { DefaultTypes } from '../shared';
import { User } from '../user';
import { NotificationType } from './notification.enums';

@ObjectType()
export class Notification extends DefaultTypes {
	@Field(type => Int)
	receiverUserId!: number;

	@Field(type => Int)
	senderUserId!: number;

	@Field(type => Int)
	activityId!: number;

	@Field(type => NotificationType)
	type!: NotificationType;

	@Field()
	read!: boolean;

	@Field(type => User, { nullable: true })
	user?: User;

	@Field(type => Activity, { nullable: true })
	activity?: Activity;
}
