import { Prisma } from '@prisma/client';

import { Filters } from '../../common/types';
import { prisma } from '../../common/utils';
import { ActivityService } from '../activity';
import { LocationService } from '../location';
import { PreparationService } from '../preparation';
import { SharedService } from '../shared';
import { SubPreparationService } from '../subPreparation';
import { AddTripInput, TripSortByInput, TripWhereInput } from '../trip/inputs';
import { UserService } from '../user/user.service';

export const add = async (params: { userId: number; data: AddTripInput }) => {
	const {
		userId,
		data: { locations, activities, preparations, ...trip }
	} = params;

	// Private trip cannot have public activities
	// if (!trip.public && activities?.some(activity => activity.public)) {}

	// Private profile user cannot create a public trip or public activities
	// const user = await UserService.user(userId);
	// if (!user?.public && trip.public && activities?.some(activity => activity.public)) {}

	const createActivities: Prisma.ActivityCreateInput[] | undefined = activities?.map(
		({
			name,
			description,
			location,
			date,
			timezone,
			public: publicActivity,
			maxPeople,
			activityTypeId,
			transportationTypeId
		}) => ({
			name,
			description,
			location,
			date,
			timezone,
			public: publicActivity,
			maxPeople,
			activityType: {
				connect: { id: activityTypeId }
			},
			transportationType: {
				connect: { id: transportationTypeId }
			}
		})
	);

	const createPreparations: Prisma.PreparationCreateWithoutTripInput[] | undefined = preparations?.map(
		({ name, description, subPreparations }) => ({
			name,
			description,
			subPreparations: {
				create: subPreparations
			}
		})
	);

	return prisma.trip.create({
		data: {
			...trip,
			userId,
			locations: {
				create: locations
			},
			activities: {
				create: createActivities
			},
			preparations: {
				create: createPreparations
			}
		}
	});
};

export const edit = async (params: { tripId: number; userId: number; data: AddTripInput }) => {
	const {
		tripId,
		userId,
		data: { locations, activities, preparations, ...trip }
	} = params;

	await LocationService.deleteManyByTripId(tripId, userId);
	await ActivityService.deleteManyByTripId(tripId, userId);
	await PreparationService.deleteManyByTripId(tripId, userId);
	await SubPreparationService.deleteManyByTripId(tripId, userId);

	return await prisma.trip.update({
		where: {
			userId_id: {
				id: tripId,
				userId: userId
			}
		},
		data: {
			...trip,
			locations: {
				create: locations
			},
			activities: {
				create: activities
			},
			preparations: {
				create: preparations
			}
		}
	});
};

export const deleteOne = async (tripId: number, userId: number) => {
	return prisma.trip.delete({
		where: {
			userId_id: {
				id: tripId,
				userId
			}
		}
	});
};

/**
 * Find the first trip that matches the filter.
 * @param  {Prisma.TripWhereInput} where - arguments to find a Trip
 */
export const getTrip = (where: Prisma.TripWhereInput) => {
	return prisma.trip.findFirst({
		where
	});
};

/**
 * Find all current user's trips that matches the filter.
 * @param  {Filters<TripWhereInput, TripSortByInput> & { userId: number }} params - arguments to find current user's trips
 */
export const getUserTrips = async (params: Filters<TripWhereInput, TripSortByInput> & { userId: number }) => {
	const { userId, where, pagination, orderBy } = params;

	const tripWhereInput = SharedService.tripWhereInput(where);

	const totalCount = await prisma.trip.count({
		where: {
			userId,
			...tripWhereInput
		}
	});

	const trips = await prisma.trip.findMany({
		where: {
			userId,
			...tripWhereInput
		},
		orderBy,
		skip: pagination?.skip,
		take: pagination?.take
	});

	return {
		totalCount,
		trips
	};
};
/**
 * Find the first upcoming trip.
 * @param  {number} userId
 */
export const getUpcomingTrip = (userId: number) => {
	return prisma.trip.findFirst({
		where: {
			userId,
			dateFrom: {
				gte: new Date()
			}
		},
		orderBy: {
			dateFrom: 'asc'
		}
	});
};

export const getPublicTrips = async (params: Filters<TripWhereInput, TripSortByInput>) => {
	const { where, pagination, orderBy } = params;

	const tripWhereInput = SharedService.tripWhereInput(where);

	const totalCount = await prisma.trip.count({
		where: {
			...tripWhereInput,
			public: true
		}
	});

	const trips = await prisma.trip.findMany({
		where: {
			...tripWhereInput,
			public: true
		},
		orderBy,
		skip: pagination?.skip,
		take: pagination?.take
	});

	return {
		totalCount,
		trips
	};
};
