import { TripService } from './../trip';
import { FieldResolver, Resolver, Root } from 'type-graphql';

import { Location } from './index';
import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { helpers } from '../../common/utils';

@Resolver(of => Location)
export class LocationResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => Number, {
		description:
			'Return TripID if current User is the creator of the Trip. We do not want to expose personal fields. For Admins we always return the correct TripID'
	})
	async tripId(@Root() location: Location, @User() currentUser: CurrentUser) {
		if (helpers.hasUserRole(currentUser)) {
			const trip = await TripService.getOne(location.tripId);

			if (!trip || !helpers.isCreator(location.tripId, trip.id)) {
				return 0;
			}
		}

		return location.tripId;
	}

	/*
	 * End Field Resolvers
	 */
}
