import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { join } from 'path';

const {
    DB_USER: user = 'postgres',
    DB_HOST: host = 'localhost',
    DB_DATABASE: database = 'postgres',
    DB_PASSWORD: password = 'postgres',
    DB_PORT: port = 5432,
} = process.env;

const client = new Client({
    user,
    host,
    database,
    password,
    port: Number(port),
});

const db = {
    client: drizzle(client),
    init: async () => {
        console.log('⏳ Connecting to database...');
        await client.connect();
        console.log('💽 Database connected.');
    },
    migrate: async () => {
        console.log('⏳ Migrating database...');
        const migrationsFolder = join(process.cwd(), './drizzle');
        await migrate(db.client, { migrationsFolder });
        console.log('💽 Database migrated.');
    },
};

export default db;
