import { IsEnum, IsPositive } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

import { NotificationType } from '../notification.enums';

@InputType()
export class AddNotificationInput {
	@Field(type => Int)
	@IsPositive()
	receiverUserId!: number;

	@Field(type => Int)
	@IsPositive()
	resourceId!: number;

	@Field(type => NotificationType)
	@IsEnum(NotificationType, {
		message: 'Provide a valid type'
	})
	type!: NotificationType;
}
