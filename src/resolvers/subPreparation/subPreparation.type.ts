import { ObjectType, Field, Int } from 'type-graphql';

import { DefaultTypes } from '../shared';

@ObjectType()
export class SubPreparation extends DefaultTypes {
	@Field(type => Int)
	preparationId!: number;

	@Field()
	name!: string;

	@Field()
	status!: boolean;
}
