import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { TransportationTypeService } from './index';
import { TransportationType } from './transportationType.type';
import { AddTransportationTypeInput } from './inputs';

@Resolver(of => TransportationType)
export class TransportationTypeResolver {
	/*
	 * Queries
	 */

	@Authorized()
	@Query(returns => [TransportationType])
	transportationTypes() {
		return TransportationTypeService.getTransporationTypes();
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized(['ADMIN'])
	@Mutation(returns => TransportationType)
	addTransportationType(@Arg('data') data: AddTransportationTypeInput) {
		return TransportationTypeService.add(data);
	}

	/*
	 * End Mutations
	 */
}
