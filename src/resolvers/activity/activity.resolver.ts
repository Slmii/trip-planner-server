import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../common/decorators';
import { Context, CurrentUser } from '../../common/types';
import { ActivityType, ActivityTypeService } from '../activityType';
import { TransportationType, TransportationTypeService } from '../transportationType';
import { User as UserType } from '../user';
import { Activity, ActivityService } from './index';

@Resolver(of => Activity)
export class ActivityResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => ActivityType, {
		description: 'Fetch the activity type of an activity'
	})
	activityType(@Root() activity: Activity) {
		return ActivityTypeService.getActivityType(activity.activityTypeId);
	}

	@FieldResolver(type => TransportationType, {
		description: 'Fetch the transportation type of an activity'
	})
	transportationType(@Root() activity: Activity) {
		return TransportationTypeService.getOne(activity.transportationTypeId);
	}

	@FieldResolver(type => [UserType], {
		description: 'Fetch all users who joined/invited the activity'
	})
	async users(@Root() activity: Activity, @Ctx() { loaders }: Context) {
		return loaders.usersToActivities.load(activity.id);
	}

	/*
	 * End Field Resolvers
	 */

	/*
	 * Queries
	 */

	@Authorized()
	@Query(returns => [Activity], {
		description: "Fetch current user's trip activities, this includes both public and private activities"
	})
	myTripActivities(@Arg('tripId', type => Int) tripId: number, @User() { userId }: CurrentUser) {
		return ActivityService.getUserTripAcitivites(tripId, userId);
	}

	@Authorized()
	@Query(returns => [Activity], {
		description:
			'Fetch trip activities. If current user is the creator of the trip then it includes both public and private activities. If current user is not the creator of the trip then it will only include public activities.'
	})
	tripActivities(
		@Arg('tripId', type => Int) tripId: number,
		@Arg('isCreator', { nullable: true }) isCreator: boolean,
		@User() { userId }: CurrentUser
	) {
		if (isCreator) {
			return ActivityService.getUserTripAcitivites(tripId, userId);
		}

		return ActivityService.getPublicTripActivities(tripId);
	}

	@Authorized()
	@Query(returns => [Activity], {
		description: 'Fetch a list of public activities'
	})
	publicActivities() {
		return ActivityService.getPublicActivities();
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(returns => Boolean, {
		description: 'Link a user to an activity'
	})
	addUserToActivity(@Arg('activityId') activityId: number, @User() { userId }: CurrentUser) {
		console.log(activityId, userId);

		return true;
	}

	@Authorized()
	@Mutation(returns => Activity)
	deleteActivity(@Arg('activityId', type => Int) activityId: number, @User() { userId }: CurrentUser) {
		return ActivityService.deleteOne(activityId, userId);
	}

	/*
	 * End Mutations
	 */
}
