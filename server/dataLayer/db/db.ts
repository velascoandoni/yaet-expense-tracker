import { drizzle } from 'drizzle-orm/node-postgres';
console.log("DB INITIALIZE WITH URL: ",process.env.POSTGRES_URL)
import { users, usersRelations } from './schema/users';
import { expenses, expensesRelations } from './schema/expenses';

export const schema = {
    users,
    usersRelations,
    expenses,
    expensesRelations,
    // other tables...
  };
const databaseUrl = process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error('POSTGRES_URL environment variable is required');
}

export const db = drizzle(databaseUrl, { schema });