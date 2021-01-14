import { Filters } from '../../common/types';
import { errors, helpers, prisma } from '../../common/utils';
import { SharedService } from '../shared';
import { TripSortByInput, TripWhereInput } from '../trip/inputs';

/**
 * Add trip to current user's favorites list.
 * If current user is not the creator its only possible if trip is public,
 * if current user is the creator then its always possible.
 * @param  {number} tripId
 * @param  {number} userId
 */
export const add = async (tripId: number, userId: number) => {
	const trip = await prisma.trip.findUnique({
		where: {
			id: tripId
		}
	});

	if (!trip || (!helpers.isCreator(trip.userId!, userId) && !trip?.public)) {
		throw errors.notFound;
	}

	return prisma.favorite.create({
		data: {
			userId,
			tripId
		}
	});
};

/**
 * Get a trip in current user's favorite list. `userId` is necessary because there
 * could be more than one trip with the same `tripId` (connected to other users)
 * @param  {number} tripId
 * @param  {number} userId
 */
export const getFavorite = (tripId: number, userId: number) => {
	return prisma.favorite.findUnique({
		where: {
			userId_tripId: {
				tripId,
				userId
			}
		}
	});
};

/**
 * Get current user's favorite trips.
 * @param  {Filters<TripWhereInput, TripSortByInput> & { userId: number }} params
 */
export const getFavorites = async (params: Filters<TripWhereInput, TripSortByInput> & { userId: number }) => {
	const { userId, where, pagination, orderBy } = params;

	const tripWhereInput = SharedService.tripWhereInput(where);

	const totalCount = await prisma.trip.count({
		where: {
			...tripWhereInput,
			favorites: {
				some: {
					userId
				}
			}
		}
	});

	const favorites = await prisma.favorite.findMany({
		where: {
			trip: {
				...tripWhereInput,
				userId
			}
		},
		orderBy,
		include: {
			trip: true
		},
		skip: pagination?.skip,
		take: pagination?.take
	});

	return {
		totalCount,
		trips: favorites.map(favorite => favorite.trip)
	};
};

/**
 * Delete a trip from favorites list. Only the creator of the trip
 * can delete one.
 * @param  {number} tripId
 * @param  {number} userId
 */
export const deleteOne = (tripId: number, userId: number) => {
	return prisma.favorite.delete({
		where: {
			userId_tripId: {
				tripId,
				userId
			}
		}
	});
};
