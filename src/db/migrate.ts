import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import * as schema from './schema';

const sqlite = new Database('sqlite.db');

export const db = drizzle(sqlite, { schema });

const main = () => {
  try {
    migrate(db, { migrationsFolder: 'src/db/migrations' });
    console.log('Migrating...');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
