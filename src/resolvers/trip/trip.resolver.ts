import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Trip, TripService, TripsResponse } from './index';
import { UserService, User as UserType } from '../user';
import { Location } from '../location';
import { FavoriteService } from '../favorite';
import { PaginationInput } from '../shared';
// import { Activity } from '../activity';
import { Preparation } from '../preparation';
import { AddTripInput, TripWhereInput, TripSortByInput } from './inputs';
import { User } from '../../common/decorators';
import { Context, CurrentUser } from '../../common/types';
import { errors, helpers } from '../../common/utils';

@Resolver(of => Trip)
export class TripResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => Number, {
		description:
			'Return UserID if current User is the creator of the Trip. We do not want to expose personal fields. For Admins we always return the correct UserID'
	})
	userId(@Root() trip: Trip, @User() currentUser: CurrentUser) {
		const { userId } = currentUser;
		if (helpers.hasUserRole(currentUser) && !helpers.isCreator(trip.userId, userId)) {
			return 0;
		}

		return trip.userId;
	}

	@FieldResolver(type => UserType, {
		nullable: true,
		description: 'Fetch the related User of the Trip'
	})
	async user(@Root() trip: Trip, @User() currentUser: CurrentUser) {
		const user = await UserService.user({
			userId: trip.userId
		});

		if (!user) {
			return null;
		}

		if (helpers.hasUserRole(currentUser) && !helpers.isCreator(user.id, currentUser.userId) && !user.public) {
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

	// @FieldResolver(type => [Activity], {
	// 	description: 'Fetch all activities of a trip'
	// })
	// activities(@Root() trip: Trip, @Ctx() { loaders }: Context) {
	// 	return loaders.activity.load(trip.id);
	// }

	@FieldResolver(type => [Preparation], {
		description: 'Fetch all preparations of a trip. This is only available for the creator of the Trip'
	})
	preparations(@Root() trip: Trip, @Ctx() { loaders }: Context, @User() currentUser: CurrentUser) {
		if (helpers.hasUserRole(currentUser) && !helpers.isCreator(trip.userId, currentUser.userId)) {
			return [];
		}

		return loaders.preparation.load(trip.id);
	}

	@FieldResolver(type => Boolean, {
		description: "Check if Trip is in current user's Favorite list"
	})
	async isInFavorite(@Root() trip: Trip, @User() { userId }: CurrentUser) {
		const favorite = await FavoriteService.getOne(trip.id, userId);
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
		description:
			"Fetch a Trip. If current user has 'User' role then return a Trip if current user is the creator of the Trip. If not, then only return if Trip is publicly available"
	})
	async trip(@Arg('tripId', type => Int) tripId: number, @User() currentUser: CurrentUser) {
		const trip = await TripService.getOne(tripId);

		if (!trip || (helpers.hasUserRole(currentUser) && !helpers.isCreator(trip.userId!, currentUser.userId) && !trip.public)) {
			throw errors.notFound;
		}

		return trip;
	}

	@Authorized()
	@Query(returns => TripsResponse, {
		description: "Fetch the current user's Trips"
	})
	myTrips(
		@Arg('where', { nullable: true }) where: TripWhereInput,
		@Arg('pagination') pagination: PaginationInput,
		@Arg('orderBy', { nullable: true }) orderBy: TripSortByInput,
		@User() { userId }: CurrentUser
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
		description: 'Fetch upcoming Trip'
	})
	myUpcomingTrip(@User() { userId }: CurrentUser) {
		return TripService.getUpcomingTrip(userId);
	}

	@Authorized(['ADMIN'])
	@Query(returns => TripsResponse, {
		description: 'Fetch a list of both publicly and non-publicly available Trips, only for Admins/Dashboard'
	})
	trips(
		@Arg('where', { nullable: true }) where: TripWhereInput,
		@Arg('pagination') pagination: PaginationInput,
		@Arg('orderBy', { nullable: true }) orderBy: TripSortByInput
	) {
		return TripService.getTrips({
			where,
			pagination,
			orderBy
		});
	}

	@Authorized()
	@Query(returns => TripsResponse, {
		description: 'Fetch a list of publicly available Trips'
	})
	publicTrips(
		@Arg('where', { nullable: true }) where: TripWhereInput,
		@Arg('pagination') pagination: PaginationInput,
		@Arg('orderBy', { nullable: true }) orderBy: TripSortByInput
	) {
		return TripService.getTrips({
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
	addTrip(@Arg('data') data: AddTripInput, @User() { userId }: CurrentUser) {
		return TripService.add({
			userId,
			data
		});
	}

	@Authorized()
	@Mutation(type => Trip)
	editTrip(@Arg('tripId', type => Int) tripId: number, @Arg('data') data: AddTripInput, @User() { userId }: CurrentUser) {
		return TripService.edit({
			tripId,
			userId,
			data
		});
	}

	@Authorized()
	@Mutation(type => Trip)
	deleteTrip(@Arg('tripId', type => Int) tripId: number, @User() { userId }: CurrentUser) {
		return TripService.deleteOne(tripId, userId);
	}

	/*
	 * End Mutations
	 */
}
