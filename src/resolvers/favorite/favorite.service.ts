import { TripSortByInput, TripWhereInput } from '../trip/inputs';
import { SharedService } from '../shared';
import { Filters } from '../../common/types';
import { errors, helpers, prisma } from '../../common/utils';

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

export const getOne = (tripId: number, userId: number) => {
	return prisma.favorite.findUnique({
		where: {
			userId_tripId: {
				tripId,
				userId
			}
		}
	});
};

export const getUserFavorites = async (params: Filters<TripWhereInput, TripSortByInput> & { userId: number }) => {
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

	const favorites = await prisma.trip.findMany({
		where: {
			...tripWhereInput,
			favorites: {
				some: {
					userId
				}
			}
		},
		orderBy,
		skip: pagination?.skip,
		take: pagination?.take
	});

	return {
		totalCount,
		trips: favorites
	};
};

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
