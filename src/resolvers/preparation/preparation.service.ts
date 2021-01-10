import { prisma } from '../../common/utils';
import { AddPreparationInput } from '../preparation/inputs';

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

/**
 * Delete a preparation. Only the creator of the activity can delete one.
 * @param  {number} activityId
 * @param  {number} userId
 */
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

/**
 * Delete all trip preparations. Only the creator of the trip can delete.
 * @param  {number} tripId
 * @param  {number} userId
 */
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
