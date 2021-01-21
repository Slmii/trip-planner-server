import { Field, ObjectType } from 'type-graphql';

import { DefaultTypes } from '../shared';
import { Trip } from '../trip';
import { Role } from '../user';

@ObjectType()
export class User extends DefaultTypes {
	@Field({ nullable: true })
	email!: string;

	@Field({ nullable: true })
	firstName!: string;

	@Field({ nullable: true })
	lastName!: string;

	@Field(type => String, { nullable: true })
	get name(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	// @Field()
	// password!: string;

	@Field()
	status!: boolean;

	@Field()
	locked!: boolean;

	@Field(type => Role)
	role!: Role;

	@Field()
	public!: boolean;

	@Field({ nullable: true })
	profileImgUrl?: string;

	@Field(type => [Trip])
	trips!: Trip[];
}
