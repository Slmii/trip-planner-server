import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';

import { User } from '../../common/decorators';
import { EmailService } from '../../common/services';
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
	async addInvitations(@Arg('data') data: AddInvitationInput, @User() { userId }: CurrentUser) {
		const invitations = await InvitationService.addMany({
			...data,
			userId
		});

		for (const invitation of invitations) {
			// TODO: send out an email with link to an URL. at the URL check if user exsists, if does redirect to signin, if not redirect to signup
			// TODO: use sendgrid
			await EmailService.send({
				email: invitation.email,
				subject: 'Activity invitation',
				html: `<a href="http://localhost:3000/invitations/${invitation.token}">Activity invitation</a>`
			});
		}

		return invitations;
	}

	/*
	 * End Mutations
	 */
}
