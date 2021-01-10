import connectRedis from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';

import config from '../../config';

const RedisStore = connectRedis(session);
const redis = new Redis(config.redisUrl);

export { RedisStore, redis };
