import { Prisma } from '@prisma/client';

import { TripWhereInput } from '../trip/inputs';

export const tripWhereInput = (where?: TripWhereInput): Prisma.TripWhereInput => {
	const searchQuery: Prisma.TripWhereInput | undefined = where?.search?.contains
		? {
				OR: [
					{
						name: where.searchIn.includes('trips')
							? {
									...where.search,
									mode: 'insensitive'
							  }
							: undefined
					},
					{
						description: where.searchIn.includes('trips')
							? {
									...where.search,
									mode: 'insensitive'
							  }
							: undefined
					},
					{
						activities: where.searchIn.includes('activities')
							? {
									some: {
										OR: [
											{
												name: {
													...where?.search,
													mode: 'insensitive'
												}
											},
											{
												description: {
													...where?.search,
													mode: 'insensitive'
												}
											}
										]
									}
							  }
							: undefined
					},
					{
						preparations: where.searchIn.includes('preparations')
							? {
									some: {
										OR: [
											{
												name: {
													...where?.search,
													mode: 'insensitive'
												}
											},
											{
												description: {
													...where?.search,
													mode: 'insensitive'
												}
											}
										]
									}
							  }
							: undefined
					}
				]
		  }
		: undefined;

	const activitiesJoinQuery: Prisma.ActivityListRelationFilter | undefined =
		where?.activityType?.equals || where?.transportationType?.equals || where?.activityDate?.equals
			? {
					some: {
						activityType: {
							type: {
								...where.activityType
							}
						},
						transportationType: {
							type: {
								...where.transportationType
							}
						},
						date: {
							...where.activityDate
						}
					}
			  }
			: undefined;

	return {
		...searchQuery,
		dateFrom: {
			...where?.from
		},
		dateTo: {
			...where?.to
		},
		activities: activitiesJoinQuery
	};
};
