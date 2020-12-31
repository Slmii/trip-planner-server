import { Field, Int, ObjectType } from 'type-graphql';

import { DefaultTypes } from '../shared';

@ObjectType()
export class Location extends DefaultTypes {
	@Field(type => Int)
	tripId!: number;

	@Field()
	name!: string;
}
