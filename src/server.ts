import 'reflect-metadata';

import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import morgan from 'morgan';
import { buildSchema } from 'type-graphql';

import { ErrorInterceptor } from './common/interceptors';
import { authChecker, constants, prisma, redis, RedisStore, sentry } from './common/utils';
import config from './config';
import Logger from './loaders/logger';
import sentryLoader from './loaders/sentry';
import { createActivityLoader, createUsersToActivitiesLoader } from './resolvers/activity';
import { ActivityResolver } from './resolvers/activity/activity.resolver';
import { ActivityTypeResolver } from './resolvers/activityType/activityType.resolver';
import { FavoriteResolver } from './resolvers/favorite/favorite.resolver';
import { InvitationResolver } from './resolvers/invitation/invitation.resolver';
import { createLocationLoader } from './resolvers/location';
import { LocationResolver } from './resolvers/location/location.resolver';
import { NotificationResolver } from './resolvers/notification/notification.resolver';
import { createPreparationLoader } from './resolvers/preparation';
import { PreparationResolver } from './resolvers/preparation/preparation.resolver';
import { SubPreparationResolver } from './resolvers/subPreparation/subPreparation.resolver';
import { TransportationTypeResolver } from './resolvers/transportationType/transportationType.resolver';
import { createTripLoader } from './resolvers/trip';
import { TripResolver } from './resolvers/trip/trip.resolver';
import { UserResolver } from './resolvers/user/user.resolver';

const app = express();

const bootstrap = async () => {
	sentryLoader(app);
	Logger.info('Sentry loaded');

	// const server = await apolloLoader(app);
	// Logger.info('Apollo Express Server loaded');

	app.set('trust proxy', 1);

	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());

	app.use(
		cors({
			origin: (origin, callback) => {
				if (!origin || constants.CORS_WHITELIST.includes(origin)) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'));
				}
			},
			credentials: true,
			optionsSuccessStatus: 200
		})
	);
	app.use(
		session({
			name: config.cookieName,
			store: new RedisStore({
				client: redis
			}),
			secret: config.cookeSecret,
			cookie: {
				maxAge: constants.IS_PRODUCTION ? 1000 * 60 * 30 : 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
				sameSite: 'lax', // csrf
				secure: constants.IS_PRODUCTION,
				domain: constants.IS_PRODUCTION ? '.tripstogo.com' : undefined
			},
			saveUninitialized: false,
			resave: false
		})
	);
	app.use(graphqlUploadExpress());
	app.use(morgan<Request, Response>('combined'));

	const schema = await buildSchema({
		resolvers: [
			UserResolver,
			TripResolver,
			LocationResolver,
			FavoriteResolver,
			ActivityResolver,
			InvitationResolver,
			PreparationResolver,
			SubPreparationResolver,
			TransportationTypeResolver,
			ActivityTypeResolver,
			NotificationResolver
		],
		globalMiddlewares: [ErrorInterceptor],
		authChecker,
		validate: true,
		emitSchemaFile: true
	});

	const apolloServer = new ApolloServer({
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			prisma,
			loaders: {
				trip: createTripLoader(),
				location: createLocationLoader(),
				activity: createActivityLoader(),
				preparation: createPreparationLoader(),
				usersToActivities: createUsersToActivitiesLoader()
			}
		}),
		schema,
		// formatError: err => {
		// 	// Don't give the specific errors to the client.
		// 	// if (err.message.startsWith('Database Error: ')) {
		// 	// 	return new Error('Internal server error');
		// 	// }

		// 	return helpers.formatError(err);
		// },
		tracing: constants.IS_DEVELOPMENT,
		debug: constants.IS_DEVELOPMENT,
		playground: true,
		uploads: false,
		plugins: [sentry]
	});

	apolloServer.applyMiddleware({
		app,
		cors: false
	});

	app.listen(parseInt(config.port), () =>
		console.log(`Server ready at http://localhost:${config.port}${apolloServer.graphqlPath}`)
	);
};

bootstrap().catch((err: Error) => {
	console.error(err);
});
