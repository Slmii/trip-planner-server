import { Field, InputType } from 'type-graphql';

import { BoolFilter, DateFilter, SortOrder, StringFilter } from '../../shared';
import { Role } from '../../user';

@InputType()
export class UserWhereInput {
	@Field({ nullable: true })
	email?: StringFilter;

	@Field({ nullable: true })
	firstName?: StringFilter;

	@Field({ nullable: true })
	lastName?: StringFilter;

	@Field({ nullable: true })
	status?: BoolFilter;

	@Field({ nullable: true })
	locked?: BoolFilter;

	@Field(type => Role, { nullable: true })
	role?: Role;

	@Field({ nullable: true })
	from?: DateFilter;

	@Field({ nullable: true })
	to?: DateFilter;
}

@InputType()
export class UserOrderByInput {
	@Field(type => SortOrder, { nullable: true })
	id?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	email?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	firstName?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	lastName?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	status?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	locked?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	role?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	createdAt?: SortOrder;
}
