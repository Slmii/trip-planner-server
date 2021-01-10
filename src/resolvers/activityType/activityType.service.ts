import { prisma } from '../../common/utils';
import { AddActivityTypeInput } from '../activityType/inputs';

/**
 * Get an activity type.
 * @param  {number} activityTypeId
 */
export const getActivityType = (activityTypeId: number) => {
	return prisma.activityType.findUnique({
		where: {
			id: activityTypeId
		}
	});
};

/**
 * Get all activity types.
 */
export const getActivityTypes = () => {
	return prisma.activityType.findMany({
		orderBy: {
			name: 'asc'
		}
	});
};

/**
 * Add an activity type.
 * @param  {AddActivityTypeInput} data
 */
export const add = (data: AddActivityTypeInput) => {
	return prisma.activityType.create({
		data
	});
};
