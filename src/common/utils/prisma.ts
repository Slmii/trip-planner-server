import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
	log: [
		{
			emit: 'event',
			level: 'query'
		},
		{
			emit: 'event',
			level: 'info'
		},
		{
			emit: 'event',
			level: 'warn'
		}
	]
});

prisma.$on('query', e => {
	const stream = fs.createWriteStream('./logs/prisma-query.log', {
		flags: 'a'
	});
	stream.write(`[${e.timestamp.toISOString()}][QUERY]: ${e.query} -- PARAMETERS: ${e.params}\n`);
	stream.end();
});
prisma.$on('info', e => {
	const stream = fs.createWriteStream('./logs/prisma-query.log', {
		flags: 'a'
	});
	stream.write(`[${e.timestamp.toISOString()}][INFO]: ${e.message}\n`);
	stream.end();
});
prisma.$on('warn', e => {
	const stream = fs.createWriteStream('./logs/prisma-query.log', {
		flags: 'a'
	});
	stream.write(`[${e.timestamp.toISOString()}][WARNING]: ${e.message}\n`);
	stream.end();
});

export default prisma;
