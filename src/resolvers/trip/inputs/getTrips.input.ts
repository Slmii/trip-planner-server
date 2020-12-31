import { ArrayNotEmpty } from 'class-validator';
import { InputType, Field } from 'type-graphql';

import { DateFilter, StringFilter, SortOrder } from '../../shared';

type SearchIn = 'trips' | 'activities' | 'preparations';

@InputType()
export class TripWhereInput {
	@Field({ nullable: true })
	search?: StringFilter;

	@ArrayNotEmpty()
	@Field(type => [String])
	searchIn!: SearchIn[];

	@Field({ nullable: true })
	from?: DateFilter;

	@Field({ nullable: true })
	to?: DateFilter;

	@Field({ nullable: true })
	activityDate?: DateFilter;

	@Field({ nullable: true })
	activityType?: StringFilter;

	@Field({ nullable: true })
	transportationType?: StringFilter;
}

@InputType()
export class TripSortByInput {
	@Field(type => SortOrder, { nullable: true })
	id?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	name?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	adults?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	children?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	infants?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	createdAt?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	dateFrom?: SortOrder;

	@Field(type => SortOrder, { nullable: true })
	dateTo?: SortOrder;
}
