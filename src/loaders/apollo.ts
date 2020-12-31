import * as Sentry from '@sentry/node';
import morgan from 'morgan';
import session from 'express-session';
import cors from 'cors';
import { Application } from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import config from '../config';
import { UserResolver } from '../resolvers/user';
import { TripResolver, createTripLoader } from '../resolvers/trip';
import { FavoriteResolver } from '../resolvers/favorite';
import { createLocationLoader, LocationResolver } from '../resolvers/location';
import { ErrorInterceptor } from './../common/interceptors';
import { authChecker, constants, RedisStore, redis, prisma, sentry } from '../common/utils';

export default async (app: Application) => {
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
				domain: constants.IS_PRODUCTION ? '.tipstogo.com' : undefined
			},
			saveUninitialized: false,
			resave: false
		})
	);
	app.use(graphqlUploadExpress());
	app.use(morgan('combined'));

	const schema = await buildSchema({
		resolvers: [UserResolver, TripResolver, LocationResolver, FavoriteResolver],
		globalMiddlewares: [ErrorInterceptor],
		authChecker,
		validate: true
	});

	const apolloServer = new ApolloServer({
		context: ({ req, res }) => ({
			req,
			res,
			redis,
			prisma,
			loaders: {
				trip: createTripLoader(),
				location: createLocationLoader()
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

	return apolloServer;
};
