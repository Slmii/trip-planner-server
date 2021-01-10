import { Field, Int, ObjectType } from 'type-graphql';

import { ActivityType } from '../activityType';
import { DefaultTypes } from '../shared';
import { TransportationType } from '../transportationType';
import { User } from '../user';

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
