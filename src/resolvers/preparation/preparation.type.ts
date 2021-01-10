import { ObjectType, Field } from 'type-graphql';

import { SubPreparation } from '../subPreparation';
import { DefaultTypes } from '../shared';

@ObjectType()
export class Preparation extends DefaultTypes {
	@Field()
	name!: string;

	@Field({ nullable: true })
	description!: string;

	@Field()
	status!: boolean;

	@Field(type => [SubPreparation])
	subPreparations!: SubPreparation[];
}
