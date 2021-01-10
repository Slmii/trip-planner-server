import { Preparation } from '@prisma/client';
import DataLoader from 'dataloader';

import { prisma } from '../../common/utils';

export const createPreparationLoader = () =>
	new DataLoader<unknown, Preparation[]>(async tripIds => {
		const preparations = await prisma.preparation.findMany({
			where: {
				tripId: {
					in: tripIds as number[]
				}
			},
			include: {
				subPreparations: true
			},
			orderBy: {
				id: 'asc'
			}
		});

		const sortedPreparations = tripIds.map(tripId => {
			return preparations.filter(preparation => tripId === preparation.tripId);
		});

		return sortedPreparations;
	});
