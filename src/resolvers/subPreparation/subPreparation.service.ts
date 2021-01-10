import { errors, prisma } from '../../common/utils';

/**
 * Toggle current user's sub-preparation status to true/false.
 * @param  {number} subPreparationId
 * @param  {number} userId
 */
export const editSubPreparationStatus = async (subPreparationId: number, userId: number) => {
	const subPreparation = await prisma.subPreparation.findFirst({
		where: {
			id: subPreparationId,
			preparation: {
				trip: {
					userId
				}
			}
		}
	});

	if (!subPreparation) {
		throw errors.notFound;
	}

	return prisma.subPreparation.update({
		data: {
			status: !subPreparation?.status
		},
		where: {
			id: subPreparation?.id ?? 0
		}
	});
};

/**
 * Delete a sub-preparation. Only the creator of the sub-preparation can delete one.
 * @param  {number} subPreparationId
 * @param  {number} userId
 */
export const deleteOne = async (subPreparationId: number, userId: number) => {
	const subPreparation = await prisma.subPreparation.findFirst({
		where: {
			id: subPreparationId,
			preparation: {
				trip: {
					userId
				}
			}
		}
	});

	return prisma.subPreparation.delete({
		where: {
			id: subPreparation?.id ?? 0
		}
	});
};

/**
 * Delete all sub-preparations. Only the creator of the trip can delete.
 * @param  {number} tripId
 * @param  {number} userId
 */
export const deleteManyByTripId = (tripId: number, userId: number) => {
	return prisma.subPreparation.deleteMany({
		where: {
			preparation: {
				trip: {
					id: tripId,
					userId
				}
			}
		}
	});
};
