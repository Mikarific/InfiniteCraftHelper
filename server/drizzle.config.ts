import type { Config } from 'drizzle-kit';
import * as fs from 'fs';
import toml from 'toml';

const config = toml.parse(fs.readFileSync('../config.toml').toString());

export default {
	schema: './handlers/db/schema.ts',
	out: './drizzle',
	driver: 'better-sqlite',
	dbCredentials: {
		url: config.database.url,
	},
} satisfies Config;
