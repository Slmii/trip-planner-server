import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';

import { Activity, ActivityService } from './index';
import { User as UserType } from './../user';
import { ActivityType, ActivityTypeService } from './../activityType';
import { TransportationType, TransportationTypeService } from './../transportationType';
import { Context, CurrentUser } from '../../common/types';
import { User } from '../../common/decorators';

@Resolver(of => Activity)
export class ActivityResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => ActivityType, {
		description: 'Fetch the activity type of an activity'
	})
	activityType(@Root() activity: Activity) {
		return ActivityTypeService.getOne(activity.activityTypeId);
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
		description: "Fetch current user's trip activities, this includes both publicly and non-publicly available activities"
	})
	myTripActivities(@Arg('tripId', type => Int) tripId: number, @User() { userId }: CurrentUser) {
		return ActivityService.getUserTripAcitivites(tripId, userId);
	}

	@Authorized()
	@Query(returns => [Activity], {
		description:
			'Fetch trip activities. If current user is the creator of the trip then it includes both publicly and non-publicly available activities. If current user is not the creator of the trip then it will only include publicly available activities.'
	})
	tripActivities(
		@Arg('tripId', type => Int) tripId: number,
		@Arg('isCreator', { nullable: true }) isCreator: boolean,
		@User() { userId }: CurrentUser
	) {
		if (isCreator) {
			return ActivityService.getUserTripAcitivites(tripId, userId);
		}

		return ActivityService.getTripActivities(tripId);
	}

	@Authorized()
	@Query(returns => [Activity], {
		description: 'Fetch a list of publicly available Activities'
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
	addUserToActivity(@Arg('activityId') activityId: number, @Arg('userId') userId: number) {
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
