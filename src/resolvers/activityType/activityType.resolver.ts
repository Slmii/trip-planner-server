import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { ActivityTypeService } from './index';
import { ActivityType } from './activityType.type';
import { AddActivityTypeInput } from './inputs';

@Resolver(of => ActivityType)
export class ActivityTypeResolver {
	/*
	 * Queries
	 */

	@Authorized()
	@Query(returns => [ActivityType])
	activityTypes() {
		return ActivityTypeService.getActivityTypes();
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized(['ADMIN'])
	@Mutation(returns => ActivityType)
	addActivityType(@Arg('data') data: AddActivityTypeInput) {
		return ActivityTypeService.add(data);
	}

	/*
	 * End Mutations
	 */
}
