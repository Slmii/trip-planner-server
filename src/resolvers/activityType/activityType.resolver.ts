import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { AddActivityTypeInput } from '../ActivityType/inputs';
import { ActivityType } from './activityType.type';
import { ActivityTypeService } from './index';

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
