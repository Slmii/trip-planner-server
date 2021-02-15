import { Field, Int, ObjectType } from 'type-graphql';

import { Activity } from '../activity';
import { InvitationStatus } from '../invitation';
import { DefaultTypes } from '../shared';
import { User } from '../user';

@ObjectType()
export class Invitation extends DefaultTypes {
	@Field(type => Int)
	activityId!: number;

	@Field()
	email!: string;

	@Field(type => InvitationStatus)
	status!: InvitationStatus;

	@Field()
	expiresAt!: Date;

	@Field(type => Activity, { nullable: true })
	activity?: Activity;

	// @Field(type => User)
	// user!: User;
}

@ObjectType()
export class TokenValidationResponse {
	@Field()
	token!: string;

	@Field()
	hasAccount!: boolean;
}

export interface AddSingleInvitation {
	receiverUserId?: number;
	senderUserId: number;
	activityId: number;
	email: string;
}
