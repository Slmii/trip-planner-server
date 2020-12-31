import { prisma } from '../../common/utils';
import { AddPreparationInput } from './inputs';

export const add = (tripId: number, preparation: AddPreparationInput) => {
	return prisma.preparation.create({
		data: {
			...preparation,
			trip: {
				connect: {
					id: tripId
				}
			}
		}
	});
};

export const addMany = (tripId: number, preparations: AddPreparationInput[]) => {
	const createManyPreparations = preparations.map(preparation => add(tripId, preparation));

	return Promise.all(createManyPreparations);
};

export const deleteOne = async (preparationId: number, userId: number) => {
	const preparation = await prisma.preparation.findFirst({
		where: {
			id: preparationId,
			trip: {
				userId
			}
		}
	});

	return prisma.preparation.delete({
		where: {
			id: preparation?.id ?? 0
		}
	});
};

export const deleteManyByTripId = (tripId: number, userId: number) => {
	return prisma.preparation.deleteMany({
		where: {
			trip: {
				id: tripId,
				userId
			}
		}
	});
};

export const editPreparationStatus = async (preparationId: number, userId: number) => {
	const preparation = await prisma.preparation.findFirst({
		where: {
			id: preparationId,
			trip: {
				userId
			}
		}
	});

	return prisma.preparation.update({
		data: {
			status: !preparation?.status
		},
		where: {
			id: preparation?.id ?? 0
		}
	});
};
