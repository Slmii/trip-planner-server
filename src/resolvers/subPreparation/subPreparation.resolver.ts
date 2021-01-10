import { Arg, Authorized, Int, Mutation, Resolver } from 'type-graphql';

import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { SubPreparation, SubPreparationService } from '../subPreparation';

@Resolver(of => SubPreparation)
export class SubPreparationResolver {
	/*
	 * Field Resolvers
	 */

	/*
	 * End Field Resolvers
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(type => SubPreparation)
	editSubPreparationStatus(@Arg('subPreparationId', type => Int) subPreparationId: number, @User() { userId }: CurrentUser) {
		return SubPreparationService.editSubPreparationStatus(subPreparationId, userId);
	}

	@Authorized()
	@Mutation(type => SubPreparation)
	deleteSubPreparation(@Arg('subPreparationId', type => Int) subPreparationId: number, @User() { userId }: CurrentUser) {
		return SubPreparationService.deleteOne(subPreparationId, userId);
	}

	/*
	 * End Mutations
	 */
}
