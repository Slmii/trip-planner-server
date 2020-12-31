import config from '../../config';

export const IS_PRODUCTION = config.env === 'production';
export const IS_DEVELOPMENT = config.env === 'development';
export const CORS_WHITELIST = ['http://localhost:3000', 'http://localhost:4000'];
