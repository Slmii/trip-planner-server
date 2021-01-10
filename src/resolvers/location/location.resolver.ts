import { FieldResolver, Resolver, Root } from 'type-graphql';

import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { helpers } from '../../common/utils';
import { Location } from '../location';
import { TripService } from '../trip';

@Resolver(of => Location)
export class LocationResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => Number, {
		description: 'Return tripId if current user is the creator of the Trip. We do not want to expose personal fields'
	})
	async tripId(@Root() location: Location, @User() currentUser: CurrentUser) {
		if (helpers.hasUserRole(currentUser)) {
			const { userId } = currentUser;

			const trip = await TripService.getTrip({
				id: location.tripId,
				userId
			});

			if (!trip) {
				return 0;
			}
		}

		return location.tripId;
	}

	/*
	 * End Field Resolvers
	 */
}
