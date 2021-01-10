import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../common/decorators';
import { CurrentUser } from '../../common/types';
import { Activity, ActivityService } from '../activity';
import { Invitation, InvitationService } from '../invitation';
import { AddInvitationInput } from '../invitation/inputs';
import { User as UserType, UserService } from '../user';

@Resolver(of => Invitation)
export class InvitationResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => Activity, {
		nullable: true
	})
	activity(@Root() invitation: Invitation) {
		return ActivityService.getPublicActivity(invitation.activityId);
	}

	@FieldResolver(type => UserType, {
		nullable: true
	})
	user(@Root() invitation: Invitation) {
		return UserService.findUserByEmail(invitation.email);
	}

	/*
	 * End Field Resolvers
	 */

	/*
	 * Queries
	 */

	@Authorized()
	@Query(returns => [Invitation])
	receivedInvitations(@User() { userId }: CurrentUser) {
		return InvitationService.getReceivedInvitations(userId);
	}

	@Authorized()
	@Query(returns => [Invitation])
	sentInvitations(@User() { userId }: CurrentUser) {
		return InvitationService.getSentInvitations(userId);
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Authorized()
	@Mutation(returns => [Invitation])
	addInvitations(@Arg('data') data: AddInvitationInput, @User() { userId }: CurrentUser) {
		return InvitationService.addMany({
			...data,
			userId
		});
	}

	/*
	 * End Mutations
	 */
}
