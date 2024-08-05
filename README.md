# Blogeo

## Introduction
This is a simple proof-of-concept automated blog builder.
The backend is built with [Bun](https://bun.sh) and [Drizzle ORM](https://drizzle.org/).
The frontend is built with [Bun](https://bun.sh), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/).

## Getting Started - Backend

### Prerequisites
-   [Bun](https://bun.sh)
-   [PostgreSQL](https://www.postgresql.org/)

### Installation
1. Clone the repository
```bash
git clone https://github.com/adidoesnt/blogeo.git
```
2. Install dependencies
```bash
cd blogeo
bun install
```
3. Create a `.env` file in the root directory and add the following variables:
```bash
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=postgres
DB_PASSWORD=postgres
DB_PORT=5432
```
4. Create the database schema
```bash
bunx drizzle-kit generate
```
5. Run the migrations
```bash
bun run src/components/database/migrate.ts
```
6. Run the server
```bash
bun run src/index.ts
```

## License
[MIT](https://choosealicense.com/licenses/mit/)