import { Query, Resolver, Ctx, Arg, Authorized, FieldResolver, Root, Mutation, Int } from 'type-graphql';

import { UserService, User as UserType } from './index';
import { ChangeForgottenPasswordInput, AddUserInput, EditUserInput, SignInInput, UserOrderByInput, UserWhereInput } from './inputs';
import { Trip } from '../trip';
import { Favorite } from '../favorite';
import { User } from '../../common/decorators';
import { Context, CurrentUser } from '../../common/types';
import { PaginationInput } from '../shared';
import { EmailService } from '../../common/services';
import { helpers, prisma } from '../../common/utils';

@Resolver(of => UserType)
export class UserResolver {
	/*
	 * Field Resolvers
	 */

	@FieldResolver(type => [Trip], {
		description: 'Fetch the related Trips of the User'
	})
	trips(@Root() user: UserType, @Ctx() { loaders }: Context) {
		return loaders.trip.load(user.id);
	}

	@FieldResolver(type => [Favorite], {
		description: 'Fetch the related Favorites of the User'
	})
	favorites(@Root() user: UserType) {
		return prisma.favorite.findMany({
			where: {
				userId: user.id
			}
		});
	}

	/*
	 * End Field Resolvers
	 */

	/*
	 * Queries
	 */
	@Authorized()
	@Query(returns => UserType, {
		nullable: true,
		description:
			"Fetch the current user that is logged in. This can never be null because we use the @Authorized decorator, if not authorized then it'll throw an error"
	})
	me(@User() { userId }: CurrentUser) {
		return UserService.user({
			userId
		});
	}

	@Authorized(['ADMIN'])
	@Query(returns => [UserType], {
		description: 'Fetch a User'
	})
	user(@Arg('userId', type => Int) userId: number) {
		return UserService.user({
			userId,
			options: {
				throwError: true
			}
		});
	}

	@Authorized(['ADMIN'])
	@Query(returns => [UserType], {
		description: 'Fetch a list of Users, only for Admins/Dashboard'
	})
	users(
		@Arg('where', type => UserWhereInput, { nullable: true }) where: UserWhereInput,
		@Arg('orderBy', type => UserOrderByInput, { nullable: true }) orderBy: UserOrderByInput,
		@Arg('pagination') pagination: PaginationInput
	) {
		return UserService.users({
			where,
			orderBy,
			pagination
		});
	}

	/*
	 * End Queries
	 */

	/*
	 * Mutations
	 */

	@Mutation(returns => UserType)
	async signIn(@Arg('data') { email, password }: SignInInput, @Ctx() { req }: Context) {
		const user = await UserService.signIn(email, password);

		// Login User
		helpers.setCurrentUser(req, user);

		return user;
	}

	@Authorized()
	@Mutation(returns => Boolean)
	signOut(@Ctx() { req, res }: Context): Promise<boolean> {
		return UserService.signOut(req, res);
	}

	// @ValidateArgs(signUpSchema)
	@Mutation(returns => UserType)
	async signUp(@Arg('data') data: AddUserInput, @Ctx() { req }: Context) {
		const user = await UserService.add(data);

		// Login User
		helpers.setCurrentUser(req, user);

		return user;
	}

	@Authorized()
	@Mutation(returns => UserType)
	async editUser(@Arg('data') data: EditUserInput, @Ctx() { req }: Context, @User() { userId }: CurrentUser) {
		const user = await UserService.edit(userId, data);

		// Login User
		helpers.setCurrentUser(req, user);

		return user;
	}

	@Authorized()
	@Mutation(returns => UserType)
	editPassword(@Arg('password') password: string, @User() { userId }: CurrentUser) {
		return UserService.editPassword(userId, password);
	}

	@Mutation(returns => String)
	async forgottenPassword(@Arg('email') email: string) {
		const { user, token } = await UserService.forgottenPassword(email);

		if (user) {
			// Send an email with a link to change password
			await EmailService.send({
				email,
				html: `<a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`
			});
		}

		return token;
	}

	@Mutation(returns => Boolean)
	async changeForgottenPassword(@Arg('data') { token, password }: ChangeForgottenPasswordInput, @Ctx() { req, redis }: Context) {
		const user = await UserService.changeForgottenPassword(token, password);

		// Remove used token from Redis
		await redis.del(token);

		// Login User
		helpers.setCurrentUser(req, user);

		return true;
	}

	@Authorized(['ADMIN'])
	@Mutation(returns => UserType)
	deleteUser(@Arg('userId', type => Int) userId: number) {
		return UserService.delete(userId);
	}

	/*
	 * End Mutations
	 */
}
