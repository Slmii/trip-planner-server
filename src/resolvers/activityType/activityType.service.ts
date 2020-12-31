import { prisma } from '../../common/utils';
import { AddActivityTypeInput } from './inputs';

export const getOne = (activityTypeId: number) => {
	return prisma.activityType.findUnique({
		where: {
			id: activityTypeId
		}
	});
};

export const getActivityTypes = () => {
	return prisma.activityType.findMany();
};

export const add = (data: AddActivityTypeInput) => {
	return prisma.activityType.create({
		data
	});
};
