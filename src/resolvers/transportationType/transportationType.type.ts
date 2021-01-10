import { Field, ObjectType } from 'type-graphql';

import { DefaultTypes } from '../shared';

@ObjectType()
export class TransportationType extends DefaultTypes {
	@Field()
	name!: string;

	@Field()
	type!: string;
}
