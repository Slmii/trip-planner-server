import DataLoader from 'dataloader';
import { Preparation } from '@prisma/client';

import { prisma } from '../../common/utils';

export const createPreparationLoader = () =>
	new DataLoader<unknown, Preparation[]>(async tripIds => {
		const preparations = await prisma.preparation.findMany({
			where: {
				tripId: {
					in: tripIds as number[]
				}
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