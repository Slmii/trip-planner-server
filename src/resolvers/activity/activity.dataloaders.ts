import { Activity, User } from '@prisma/client';
import DataLoader from 'dataloader';

import { prisma } from '../../common/utils';

export const createActivityLoader = () =>
	new DataLoader<unknown, Activity[]>(async tripIds => {
		const activities = await prisma.activity.findMany({
			where: {
				tripId: {
					in: tripIds as number[]
				}
			}
		});

		const sortedActivities = tripIds.map(tripId => {
			return activities.filter(activity => tripId === activity.tripId);
		});

		return sortedActivities;
	});

export const createUsersToActivitiesLoader = () =>
	new DataLoader<unknown, User[]>(async activityIds => {
		const results = await prisma.userToActivities.findMany({
			where: {
				activityId: {
					in: activityIds as number[]
				},
				user: {
					public: true
				}
			},
			include: {
				user: true
			}
		});

		const sortedResults = activityIds.map(activityId => {
			return results.filter(result => activityId === result.activityId);
		});

		return sortedResults.map(results => results.map(result => result.user));
	});
