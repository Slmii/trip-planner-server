import { Field, ObjectType } from 'type-graphql';

import { DefaultTypes } from '../shared';
import { Trip } from '../trip';
import { Role } from '../user';

@ObjectType()
export class User extends DefaultTypes {
	@Field()
	email!: string;

	@Field()
	firstName!: string;

	@Field()
	lastName!: string;

	@Field(type => String)
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

	@Field()
	profileImgUrl?: string;

	@Field()
	dateOfBirth?: Date;

	@Field(type => [Trip])
	trips!: Trip[];
}
