import winston from 'winston';

const Logger = winston.createLogger({
	level: 'info',
	levels: winston.config.npm.levels,
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'DD-MM-YYYY HH:mm:ss'
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: './logs/info.log' })
	]
});

export default Logger;
