import config from '../../../config.toml';

import { Database } from 'bun:sqlite';
import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/bun-sqlite';

import * as schema from './schema';

console.log(`${chalk.blue.bold('[SQLite]')} SQLite ${chalk.green('Connecting')}...`);
export const sqlite = new Database(`./server/${config.database.url}`);
export const db = drizzle(sqlite);

await db
	.insert(schema.lineage)
	.values([
		{
			id: 0,
			result: 'Water',
			emoji: '💧',
			first: '',
			firstEmoji: '',
			second: '',
			secondEmoji: '',
			dependancies: new Set([]),
		},
		{
			id: 1,
			result: 'Fire',
			emoji: '🔥',
			first: '',
			firstEmoji: '',
			second: '',
			secondEmoji: '',
			dependancies: new Set([]),
		},
		{
			id: 2,
			result: 'Wind',
			emoji: '🌬️',
			first: '',
			firstEmoji: '',
			second: '',
			secondEmoji: '',
			dependancies: new Set([]),
		},
		{
			id: 3,
			result: 'Earth',
			emoji: '🌍',
			first: '',
			firstEmoji: '',
			second: '',
			secondEmoji: '',
			dependancies: new Set([]),
		},
	])
	.onConflictDoNothing();

console.log(`${chalk.blue.bold('[SQLite]')} SQLite ${chalk.green('Connected')}.`);

process.on('SIGINT', async () => {
	console.log(`\n${chalk.blue.bold('[SQLite]')} SQLite ${chalk.red('Disconnecting')}...`);
	sqlite.close();
	console.log(`${chalk.blue.bold('[SQLite]')} SQLite ${chalk.red('Disconnected')}.`);
	process.exit();
});

export * from './schema';
