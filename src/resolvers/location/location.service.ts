import { prisma } from '../../common/utils';

/**
 * Add a location to a trip.
 * @param  {number} tripId
 * @param  {string} name
 */
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

/**
 * Add many locations to one trip.
 * @param  {number} tripId
 * @param  {string[]} locations
 */
export const addMany = (tripId: number, locations: string[]) => {
	const createManyLocations = locations.map(location => add(tripId, location));

	return Promise.all(createManyLocations);
};

/**
 * TODO: check if user is creator of the trip/location
 * Delete a location.
 * @param  {number} locationId
 */
export const deleteOne = (locationId: number) => {
	return prisma.location.delete({
		where: {
			id: locationId
		}
	});
};

/**
 * TODO: check if user is creator of the trip/location
 * Delete many locations.
 * @param  {number} locationId
 */
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

/**
 * Delete all trip locations. Only the creator of the trip can delete.
 * @param  {number} tripId
 * @param  {number} userId
 */
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
