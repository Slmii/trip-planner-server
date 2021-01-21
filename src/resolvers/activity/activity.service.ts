import { prisma } from '../../common/utils';
import { AddActivityInput } from '../activity/inputs';

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
 * Add a user to join an activity.
 * @param  {number} activityId
 * @param  {number} userId
 */
export const addUserToActivity = (activityId: number, userId: number) => {
	// TODO:
	// If activity is private then only available to join when creator has invited someone. Trip
	// and user profile do not need to be public.
	// Private activities or not available in the 'explore' pages.
	// Public activities are only available for joining if trip and activity are public.
	// 1. check if user has an invitation.
	// 2. show in front-end that when a user has a private profile that its highly unlikely
	// to be accepted as a requestor. Private profiles do not personal information.

	return prisma.userToActivities.create({
		data: {
			activityId,
			userId
		}
	});
};

/**
 * Get current user's public and private activities when viewing a trip.
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
 * Get public activities when viewing a trip. Available for everyone
 * thus can be used in explore page.
 * @param  {number} tripId
 */
export const getPublicTripActivities = (tripId: number) => {
	return prisma.activity.findMany({
		where: {
			tripId,
			public: true
		}
	});
};

/**
 * Get a public activity. Available for everyone thus can be used in
 * explore page.
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
 * Get all public activities. Available for everyone thus can be used in
 * explore page.
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
 * Get current user's activity.
 * @param  {number} activityId
 * @param  {number} userId
 */
export const getUserActivity = (activityId: number, userId: number) => {
	return prisma.activity.findFirst({
		where: {
			id: activityId,
			trip: {
				userId
			}
		}
	});
};

/**
 * Get all current user's public and private activities.
 * @param  {number} userId
 */
export const getUserActivities = (userId: number) => {
	// TODO: implement filters.
	return prisma.activity.findMany({
		where: {
			trip: {
				userId
			}
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

/**
 * Delete all trip activities. Only the creator of the trip can delete.
 * @param  {number} tripId
 * @param  {number} userId
 */
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
