import { prisma } from '../../common/utils';

export const LocationService = {};

export const add = (tripId: number, name: string) => {
	return prisma.location.create({
		data: {
			name,
			trip: {
				connect: {
					id: tripId
				}
			}
		}
	});
};

export const addMany = (tripId: number, locations: string[]) => {
	const createManyLocations = locations.map(location => add(tripId, location));

	return Promise.all(createManyLocations);
};

export const deleteOne = (locationId: number) => {
	return prisma.location.delete({
		where: {
			id: locationId
		}
	});
};

export const deleteMany = async (locationIds: number[]) => {
	const locations = await prisma.location.deleteMany({
		where: {
			id: {
				in: locationIds
			}
		}
	});

	return locations;
};

export const deleteManyByTripId = (tripId: number, userId: number) => {
	return prisma.location.deleteMany({
		where: {
			trip: {
				id: tripId,
				userId
			}
		}
	});
};
