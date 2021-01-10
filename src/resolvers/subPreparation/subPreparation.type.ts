import { Field, Int, ObjectType } from 'type-graphql';

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
