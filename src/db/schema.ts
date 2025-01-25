import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuid } from 'uuid';

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey().$defaultFn(uuid),
  text: text('text').notNull(),
  isCompleted: integer('isCompleted', { mode: 'boolean' }).notNull(),
  createdAt: integer('timestamp', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
