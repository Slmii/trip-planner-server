import { Field, Int, ObjectType } from 'type-graphql';

import { DefaultTypes } from '../shared';
import { Trip } from '../trip';
import { User } from '../user';

@ObjectType()
export class Favorite extends DefaultTypes {
	@Field(type => Int)
	userId!: number;

	@Field(type => Int)
	tripId!: number;

	@Field(type => User, { nullable: true })
	user!: User;

	@Field(type => Trip, { nullable: true })
	trip!: Trip;
}
