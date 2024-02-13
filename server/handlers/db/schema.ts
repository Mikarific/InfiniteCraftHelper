import { sqliteTable, text, integer, customType } from 'drizzle-orm/sqlite-core';

const dependancies = customType<{ data: Set<number> }>({
	dataType() {
		return 'blob';
	},
	toDriver(val) {
		return new Uint32Array(val);
	},
	fromDriver(val) {
		const dataView = new DataView(Uint8Array.from(val as Buffer).buffer);
		let set: Set<number> = new Set();
		for (let i = 0; i < dataView.byteLength / 4; i++) {
			set.add(dataView.getInt32(i * 4, true));
		}
		return set;
	},
});

export const lineage = sqliteTable('lineage', {
	id: integer('id').notNull().unique().primaryKey({ autoIncrement: true }),
	result: text('result').notNull().unique(),
	emoji: text('emoji').notNull(),
	first: text('first').notNull(),
	firstEmoji: text('firstEmoji').notNull(),
	second: text('second').notNull(),
	secondEmoji: text('secondEmoji').notNull(),
	dependancies: dependancies('dependancies').notNull(),
});
export const recipes = sqliteTable('recipes', {
	id: integer('id').notNull().unique().primaryKey({ autoIncrement: true }),
	result: text('result').notNull(),
	emoji: text('emoji').notNull(),
	first: text('first').notNull(),
	firstEmoji: text('firstEmoji').notNull(),
	second: text('second').notNull(),
	secondEmoji: text('secondEmoji').notNull(),
});
