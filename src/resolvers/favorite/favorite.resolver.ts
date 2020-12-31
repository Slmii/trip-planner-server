import { UserService } from './../user/user.service';
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { User } from '../../common/decorators';

import { Favorite, FavoriteService } from '../favorite';
import { User as UserType } from '../user';
import { Trip, TripSortByInput, TripService, TripsResponse, TripWhereInput } from '../trip';
import { PaginationInput } from '../shared';
import { CurrentUser } from '../../common/types';

@Resolver(of => Favorite)
export class FavoriteResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => UserType, {
		description: 'Fetch the related Trip of the Favorite'
	})
	user(@Root() favorite: Favorite) {
		return UserService.user({
			userId: favorite.userId
		});
	}

	@FieldResolver(type => Trip, {
		description: 'Fetch the related Trip of the Favorite'
	})
	trip(@Root() favorite: Favorite) {
		return TripService.getOne(favorite.tripId);
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
		return FavoriteService.getUserFavorites({
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
