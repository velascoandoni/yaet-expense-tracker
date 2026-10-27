import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { expenses } from './expenses';

export const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(),
  name: text('name').notNull().unique(),
  password: text('password').notNull(),
  salt:text(`salt`).notNull(),
  admin:boolean("admin").default(false)
});

export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
}));


