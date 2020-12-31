import { Prisma } from '@prisma/client';

import { AddTripInput, TripWhereInput, TripSortByInput } from './inputs';
import { LocationService } from '../location';
import { ActivityService } from '../activity';
import { PreparationService } from '../preparation';
import { SharedService } from '../shared';
import { Filters } from '../../common/types';
import { prisma } from '../../common/utils';

export const add = (params: { userId: number; data: AddTripInput }) => {
	const {
		userId,
		data: { locations, activities, preparations, ...trip }
	} = params;

	const createActivities: Prisma.ActivityCreateInput[] | undefined = activities?.map(
		({ name, description, location, date, timezone, public: publicActivity, maxPeople, activityTypeId, transportationTypeId }) => ({
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
				create: preparations
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

export const getOne = (tripId: number) => {
	return prisma.trip.findUnique({
		where: {
			id: tripId
		}
	});
};

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

export const getTrips = async (params: Filters<TripWhereInput, TripSortByInput>) => {
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
