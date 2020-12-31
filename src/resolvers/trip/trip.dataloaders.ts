import DataLoader from 'dataloader';
import { Trip } from '@prisma/client';

import { prisma } from '../../common/utils';

export const createTripLoader = () =>
	new DataLoader<unknown, Trip[]>(async tripIds => {
		const trips = await prisma.trip.findMany({
			where: {
				userId: {
					in: tripIds as number[]
				}
			}
		});

		const sortedTrips = tripIds.map(tripId => {
			return trips.filter(trip => tripId === trip.userId);
		});

		return sortedTrips;
	});
