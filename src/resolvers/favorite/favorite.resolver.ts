import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { Favorite, FavoriteService } from '../favorite';
import { PaginationInput } from '../shared';
import { Trip, TripService, TripsResponse } from '../trip';
import { TripSortByInput, TripWhereInput } from '../trip/inputs';
import { User as UserType, UserService } from '../user';

@Resolver(of => Favorite)
export class FavoriteResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => UserType, {
		description: 'Fetch the related User of Favorite'
	})
	user(@Root() favorite: Favorite) {
		return UserService.user(favorite.userId);
	}

	@FieldResolver(type => Trip, {
		description: 'Fetch the related Trip of the Favorite'
	})
	trip(@Root() favorite: Favorite, @User() { userId }: CurrentUser) {
		return TripService.getTrip({
			id: favorite.tripId,
			userId
		});
	}

	/*
	 * Queries
	 */

	@Authorized()
	@Query(returns => TripsResponse, {
		description: "Fetch the current user's favorites"
	})
	myFavorites(
		@Arg('where', type => TripWhereInput, { nullable: true }) where: TripWhereInput,
		@Arg('pagination', type => PaginationInput) pagination: PaginationInput,
		@Arg('orderBy', type => TripSortByInput, { nullable: true }) orderBy: TripSortByInput,
		@User() { userId }: CurrentUser
	) {
		return FavoriteService.getFavorites({
			userId,
			where,
			pagination,
			orderBy
		});
	}

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(type => Favorite, {
		description:
			'Only add to Favorite if the Trip is publicly available. If current user is the creator of the Trip then its always allowed'
	})
	addFavorite(@Arg('tripId', type => Int) tripId: number, @User() { userId }: CurrentUser) {
		return FavoriteService.add(tripId, userId);
	}

	@Authorized()
	@Mutation(type => Favorite)
	deleteFavorite(@Arg('tripId', type => Int) tripId: number, @User() { userId }: CurrentUser) {
		return FavoriteService.deleteOne(tripId, userId);
	}
}
