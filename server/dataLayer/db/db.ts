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
export const db = drizzle(process.env.POSTGRES_URL,{schema} );