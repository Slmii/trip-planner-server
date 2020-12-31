import { ObjectType, Field, Int } from 'type-graphql';

import { User } from '../user';
import { Location } from '../location';
import { DefaultTypes } from '../shared';
// import { Activity } from '../activity';
import { Preparation } from './../preparation';

@ObjectType()
export class Trip extends DefaultTypes {
	@Field(type => Int)
	userId!: number;

	@Field()
	name!: string;

	@Field({ nullable: true })
	description?: string;

	@Field()
	public!: boolean;

	@Field()
	dateFrom!: Date;

	@Field()
	dateTo!: Date;

	@Field(type => Int)
	adults!: number;

	@Field(type => Int)
	children!: number;

	@Field(type => Int)
	infants!: number;

	@Field({ nullable: true })
	backgroundUrl?: string;

	@Field(type => User, { nullable: true })
	user?: User;

	@Field(type => [Location])
	locations!: Location[];

	// @Field(type => [Activity])
	// activities!: Activity[];

	@Field(type => [Preparation])
	preparations!: Preparation[];

	@Field(type => Boolean)
	isInFavorite!: boolean;
}

@ObjectType()
export class TripsResponse {
	@Field(() => Int)
	totalCount!: number;

	@Field(type => [Trip])
	trips!: Trip[];
}
