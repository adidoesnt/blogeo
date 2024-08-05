import { defineConfig } from 'drizzle-kit';

const {
    NODE_ENV: env = 'DEV',
    DB_USER: user = 'postgres',
    DB_HOST: host = 'localhost',
    DB_DATABASE: database = 'postgres',
    DB_PASSWORD: password = '',
    DB_PORT: port = 5432,
} = process.env;

export default defineConfig({
    schema: './src/components/database/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host,
        user,
        port: Number(port),
        password,
        database,
        ssl: env !== 'DEV',
    },
});
