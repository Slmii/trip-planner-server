import { Arg, Authorized, Int, Mutation, Resolver } from 'type-graphql';

import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { Preparation, PreparationService } from '../preparation';

@Resolver(of => Preparation)
export class PreparationResolver {
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
	@Mutation(type => Preparation)
	deletePreparation(@Arg('preparationId', type => Int) preparationId: number, @User() { userId }: CurrentUser) {
		return PreparationService.deleteOne(preparationId, userId);
	}

	/*
	 * End Mutations
	 */
}
