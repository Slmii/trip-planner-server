import { ObjectType, Field } from 'type-graphql';

import { Role } from './user.enums';
import { Trip } from '../trip';
import { Favorite } from '../favorite';
import { DefaultTypes } from '../shared';

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

	@Field(type => [Trip])
	trips!: Trip[];

	@Field(type => [Favorite])
	favorites!: Favorite[];
}
