import { ObjectType, Field, Int } from 'type-graphql';

import { User } from '../user';
import { Trip } from '../trip';
import { DefaultTypes } from '../shared';

@ObjectType()
export class Favorite extends DefaultTypes {
	@Field(type => Int)
	userId!: number;

	@Field(type => Int)
	tripId!: number;

	@Field(type => User)
	user!: User;

	@Field(type => Trip)
	trip!: Trip;
}
