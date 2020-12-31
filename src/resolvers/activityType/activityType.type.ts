import { ObjectType, Field } from 'type-graphql';

import { DefaultTypes } from '../shared';

@ObjectType()
export class ActivityType extends DefaultTypes {
	@Field()
	name!: string;

	@Field()
	type!: string;
}
