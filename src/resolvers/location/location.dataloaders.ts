import { Location } from '@prisma/client';
import DataLoader from 'dataloader';

import { prisma } from '../../common/utils';

export const createLocationLoader = () =>
	new DataLoader<unknown, Location[]>(async tripIds => {
		const locations = await prisma.location.findMany({
			where: {
				tripId: {
					in: tripIds as number[]
				}
			}
		});

		const sortedTrips = tripIds.map(tripId => {
			return locations.filter(location => tripId === location.tripId);
		});

		return sortedTrips;
	});
