import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User as UserDecorator } from '../../common/decorators';
import { Context, CurrentUser } from '../../common/types';
import { helpers } from '../../common/utils';
import { FavoriteService } from '../favorite';
import { Location } from '../location';
import { Preparation } from '../preparation';
import { PaginationInput } from '../shared';
import { Trip, TripService, TripsResponse } from '../trip';
import { AddTripInput, TripSortByInput, TripWhereInput } from '../trip/inputs';
import { User, UserService } from '../user';

@Resolver(of => Trip)
export class TripResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => Number, {
		description:
			'Return userId if current user is the creator of the trip. We do not want to expose personal fields'
	})
	userId(@Root() trip: Trip, @UserDecorator() currentUser: CurrentUser) {
		const { userId } = currentUser;

		if (!helpers.isCreator(trip.userId, userId)) {
			return 0;
		}

		return trip.userId;
	}

	@FieldResolver(type => User, {
		nullable: true,
		description:
			'Fetch the related user of the trip. If current user is not the creator of the trip then only available if user has a public profile'
	})
	async user(@Root() trip: Trip, @UserDecorator() { userId }: CurrentUser) {
		const user = await UserService.user(trip.userId);

		if (!user) {
			return null;
		}

		if (!helpers.isCreator(trip.userId, userId) && !user.public) {
			return null;
		}

		return user;
	}

	@FieldResolver(type => [Location], {
		description: 'Fetch all locations of a trip'
	})
	locations(@Root() trip: Trip, @Ctx() { loaders }: Context) {
		return loaders.location.load(trip.id);
	}

	@FieldResolver(type => [Preparation], {
		description: 'Fetch all preparations of a trip. This is only available for the creator of the trip'
	})
	preparations(@Root() trip: Trip, @Ctx() { loaders }: Context, @UserDecorator() { userId }: CurrentUser) {
		if (!helpers.isCreator(trip.userId, userId)) {
			return [];
		}

		return loaders.preparation.load(trip.id);
	}

	@FieldResolver(type => Boolean, {
		description: "Check if trip is in current user's favorite list"
	})
	async isInFavorite(@Root() trip: Trip, @UserDecorator() { userId }: CurrentUser) {
		const favorite = await FavoriteService.getFavorite(trip.id, userId);
		return favorite ? true : false;
	}

	/*
	 * End Field Resolvers
	 */

	/*
	 * Queries
	 */
	@Authorized()
	@Query(returns => Trip, {
		nullable: true,
		description:
			"Fetch a trip. Return a user's trip if current user is the creator of the trip. If not, then only return if trip is publicly available"
	})
	async trip(
		@Arg('tripId', type => Int) tripId: number,
		@Arg('isCreator', { nullable: true }) isCreator: boolean,
		@UserDecorator() { userId }: CurrentUser
	) {
		if (isCreator) {
			return TripService.getTrip({
				id: tripId,
				userId
			});
		}

		return TripService.getTrip({
			id: tripId,
			public: true
		});
	}

	@Authorized()
	@Query(returns => TripsResponse, {
		description: "Fetch the current user's Trips"
	})
	myTrips(
		@Arg('where', { nullable: true }) where: TripWhereInput,
		@Arg('pagination') pagination: PaginationInput,
		@Arg('orderBy', { nullable: true }) orderBy: TripSortByInput,
		@UserDecorator() { userId }: CurrentUser
	) {
		return TripService.getUserTrips({
			userId,
			where,
			pagination,
			orderBy
		});
	}

	@Authorized()
	@Query(returns => Trip, {
		nullable: true,
		description: 'Fetch upcoming Trip'
	})
	myUpcomingTrip(@UserDecorator() { userId }: CurrentUser) {
		return TripService.getUpcomingTrip(userId);
	}

	// @Authorized(['ADMIN'])
	// @Query(returns => TripsResponse, {
	// 	description: 'Fetch a list of both publicly and non-publicly available Trips, only for Admins/Dashboard'
	// })
	// trips(
	// 	@Arg('where', { nullable: true }) where: TripWhereInput,
	// 	@Arg('pagination') pagination: PaginationInput,
	// 	@Arg('orderBy', { nullable: true }) orderBy: TripSortByInput
	// ) {
	// 	return TripService.getPublicTrips({
	// 		where,
	// 		pagination,
	// 		orderBy
	// 	});
	// }

	@Authorized()
	@Query(returns => TripsResponse, {
		description: 'Fetch a list of publicly available Trips'
	})
	publicTrips(
		@Arg('where', { nullable: true }) where: TripWhereInput,
		@Arg('pagination') pagination: PaginationInput,
		@Arg('orderBy', { nullable: true }) orderBy: TripSortByInput
	) {
		return TripService.getPublicTrips({
			where,
			pagination,
			orderBy
		});
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(type => Trip)
	addTrip(@Arg('data') data: AddTripInput, @UserDecorator() { userId }: CurrentUser) {
		return TripService.add({
			userId,
			data
		});
	}

	@Authorized()
	@Mutation(type => Trip)
	editTrip(
		@Arg('tripId', type => Int) tripId: number,
		@Arg('data') data: AddTripInput,
		@UserDecorator() { userId }: CurrentUser
	) {
		return TripService.edit({
			tripId,
			userId,
			data
		});
	}

	@Authorized()
	@Mutation(type => Trip)
	deleteTrip(@Arg('tripId', type => Int) tripId: number, @UserDecorator() { userId }: CurrentUser) {
		return TripService.deleteOne(tripId, userId);
	}

	/*
	 * End Mutations
	 */
}
