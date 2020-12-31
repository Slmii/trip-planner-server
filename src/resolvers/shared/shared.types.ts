import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class DefaultTypes {
	@Field(type => Int)
	readonly id!: number;

	@Field()
	readonly uuid!: string;

	@Field()
	createdAt!: Date;

	@Field()
	updatedAt!: Date;
}
