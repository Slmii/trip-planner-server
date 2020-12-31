import { ObjectType, Field, Int } from 'type-graphql';

import { DefaultTypes } from '../shared';
import { User } from '../user';
import { ActivityType } from '../activityType';
import { TransportationType } from '../transportationType';

@ObjectType()
export class Activity extends DefaultTypes {
	// @Field(type => Int)
	// tripId!: number;

	@Field(type => Int)
	activityTypeId!: number;

	@Field(type => Int)
	transportationTypeId!: number;

	@Field()
	name!: string;

	@Field({ nullable: true })
	description?: string;

	@Field()
	location!: string;

	@Field()
	date!: Date;

	@Field()
	timezone!: string;

	@Field()
	public!: boolean;

	@Field(type => Int)
	maxPeople!: number;

	// @Field(type => Trip)
	// trip!: Trip;

	@Field(type => ActivityType)
	activityType!: ActivityType;

	@Field(type => TransportationType)
	transportationType!: TransportationType;

	@Field(type => [User])
	users!: User[];
}
