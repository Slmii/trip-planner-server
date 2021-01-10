import { Field, Int, ObjectType } from 'type-graphql';

import { Activity } from '../activity';
import { DefaultTypes } from '../shared';
import { Trip } from '../trip';
import { User } from '../user';
import { NotificationType } from './notification.enums';

@ObjectType()
export class Notification extends DefaultTypes {
	@Field(type => Int)
	receiverUserId!: number;

	@Field(type => Int)
	senderUserId!: number;

	@Field(type => Int)
	resourceId!: number;

	@Field(type => NotificationType)
	type!: NotificationType;

	@Field()
	read!: boolean;

	// @Field(type => User, { nullable: true })
	// receiver?: User;

	@Field(type => User, { nullable: true })
	sender?: User;

	@Field(type => Activity, { nullable: true })
	activity?: Activity;

	@Field(type => Trip, { nullable: true })
	trip?: Trip;
}
