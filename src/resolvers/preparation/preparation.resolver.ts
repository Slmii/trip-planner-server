import { TripService } from '../trip';
import { Arg, Authorized, FieldResolver, Int, Mutation, Resolver, Root } from 'type-graphql';

import { Preparation, PreparationService } from './index';
import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { helpers } from '../../common/utils';

@Resolver(of => Preparation)
export class PreparationResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => Number, {
		description:
			'Return TripID if current User is the creator of the Trip. We do not want to expose personal fields. For Admins we always return the correct TripID'
	})
	async tripId(@Root() preparation: Preparation, @User() currentUser: CurrentUser) {
		if (helpers.hasUserRole(currentUser)) {
			const trip = await TripService.getOne(preparation.tripId);

			if (!trip || !helpers.isCreator(preparation.tripId, trip.id)) {
				return 0;
			}
		}

		return preparation.tripId;
	}

	/*
	 * End Field Resolvers
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(type => Preparation)
	editPreparationStatus(@Arg('preparationId', type => Int) preparationId: number, @User() { userId }: CurrentUser) {
		return PreparationService.editPreparationStatus(preparationId, userId);
	}

	@Authorized()
	@Mutation(type => Preparation)
	deletePreparation(@Arg('preparationId', type => Int) preparationId: number, @User() { userId }: CurrentUser) {
		return PreparationService.deleteOne(preparationId, userId);
	}

	/*
	 * End Mutations
	 */
}
