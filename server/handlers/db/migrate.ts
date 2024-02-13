import config from '../../../config.toml';

import { Database } from 'bun:sqlite';
import { rmSync } from 'node:fs';

import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

const sqlite = new Database(`./server/${config.database.url}`);
const db = drizzle(sqlite);
await migrate(db, { migrationsFolder: './server/drizzle' });

rmSync('./server/drizzle', { recursive: true, force: true });
