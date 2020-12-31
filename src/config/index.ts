/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from 'dotenv';
const envFound = config();

if (envFound.error) {
	// This error should crash whole process
	throw new Error(`⚠️ Couldn't find .env file ⚠️`);
}

export default {
	env: process.env.NODE_ENV!,
	saltFactor: 10,
	clientId: process.env.CLIENT_ID!,
	clientSecret: process.env.CLIENT_SECRET!,
	sentryDsn: process.env.SENTRY_DSN!,
	port: process.env.PORT!,
	cookeSecret: process.env.COOKIE_SECRET!,
	redisUrl: process.env.REDIS_URL!,
	cookieName: 'qid'
};
