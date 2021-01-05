import { prisma } from '../../common/utils';
import { AddTransportationTypeInput } from './inputs';

export const getOne = (transportationTypeId: number) => {
	return prisma.transportationType.findUnique({
		where: {
			id: transportationTypeId
		}
	});
};

export const getTransporationTypes = () => {
	return prisma.transportationType.findMany({
		orderBy: {
			name: 'asc'
		}
	});
};

export const add = (data: AddTransportationTypeInput) => {
	return prisma.transportationType.create({
		data
	});
};
