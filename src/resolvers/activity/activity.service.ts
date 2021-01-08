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

/**
 * Add a user to join an activity. Only possible when the acvitity and user profile
 * are both public.
 * @param  {number} activityId
 * @param  {number} userId
 */
export const addUserToActivity = (activityId: number, userId: number) => {
	// TODO: check if user profile and activity is public, only then its allowed to join activities

	return prisma.usersToActivities.create({
		data: {
			activityId,
			userId
		}
	});
};

/**
 * Get current user's public and private activities when viewing a trip.
 * Checks if current user is creator.
 * @param  {number} tripId
 * @param  {number} userId
 */
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

/**
 * Get publicly available activities when viewing a trip.
 * Does not need a check if current user is creator.
 * @param  {number} tripId
 */
export const getTripActivities = (tripId: number) => {
	return prisma.activity.findMany({
		where: {
			tripId,
			public: true
		}
	});
};

/**
 * Get public activity.
 * Does not need a check if current user is creator.
 * @param  {number} activityId
 */
export const getPublicActivity = (activityId: number) => {
	return prisma.activity.findFirst({
		where: {
			id: activityId,
			public: true
		}
	});
};

/**
 * Get all public activities.
 * Does not need a check if current user is creator.
 */
export const getPublicActivities = () => {
	// TODO: implement filters.
	return prisma.activity.findMany({
		where: {
			public: true
		}
	});
};
/**
 * Delete an activity. Only the creator of the activity can delete one.
 * @param  {number} activityId
 * @param  {number} userId
 */
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
