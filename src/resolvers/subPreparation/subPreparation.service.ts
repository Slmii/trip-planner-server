import { prisma } from '../../common/utils';

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

	return prisma.subPreparation.update({
		data: {
			status: !subPreparation?.status
		},
		where: {
			id: subPreparation?.id ?? 0
		}
	});
};

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
