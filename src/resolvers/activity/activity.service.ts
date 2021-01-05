import { prisma } from '../../common/utils';
import { AddActivityInput } from './inputs';

export const add = (tripId: number, activity: AddActivityInput) => {
	return prisma.activity.create({
		data: {
			...activity,
			tripId
		}
	});
};

export const addMany = (tripId: number, activities: AddActivityInput[]) => {
	const createManyAcitivties = activities.map(activity => add(tripId, activity));

	return Promise.all(createManyAcitivties);
};

export const addUserToActivity = (activityId: number, userId: number) => {
	// TODO: check if user profile is public, only then its allowed to join activities

	return prisma.usersToActivities.create({
		data: {
			activityId,
			userId
		}
	});
};

export const getUserTripAcitivites = (tripId: number, userId: number) => {
	return prisma.activity.findMany({
		where: {
			trip: {
				id: tripId,
				userId
			}
		},
		orderBy: {
			date: 'asc'
		}
	});
};

export const getTripActivities = (tripId: number) => {
	return prisma.activity.findMany({
		where: {
			tripId,
			public: true
		}
	});
};

export const deleteOne = async (activityId: number, userId: number) => {
	const activity = await prisma.activity.findFirst({
		where: {
			id: activityId,
			trip: {
				userId
			}
		}
	});

	return prisma.activity.delete({
		where: {
			tripId_id: {
				id: activity?.id ?? 0,
				tripId: activity?.tripId ?? 0
			}
		}
	});
};

export const deleteManyByTripId = (tripId: number, userId: number) => {
	return prisma.activity.deleteMany({
		where: {
			trip: {
				id: tripId,
				userId
			}
		}
	});
};
