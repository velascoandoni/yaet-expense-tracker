import { relations } from 'drizzle-orm';
import { date, integer, numeric, pgEnum, pgTable, serial, text, uniqueIndex, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { users } from './users';
import { types } from './types';
import { boolean } from 'drizzle-orm/gel-core';


export const expenses = pgTable('expenses', {
  expense_id: serial('expense_id').primaryKey(),
  name: text('name').notNull(),
  date: date('date').notNull(),
  amount: numeric(`amount`).notNull(),
  repetition: numeric("repetition").notNull().default("1"),
  user_id: integer("user_id").notNull().references(() => users.user_id),
  type_id: integer("type_id").references(() => types.type_id),
  

  was_split: boolean("was_split").default(false),
  was_merged: boolean("was_merged").default(false),
  raw: boolean("raw").default(false), //CREATED FROM FILE
  active: boolean("active").notNull().default(true), //IF IT HAS NOT BEEN SPLIT OR MERGED OR DEACTIVATED

  split_from: integer("split_from").references((): AnyPgColumn => expenses.expense_id),
  merged_to: integer("merged_to").references((): AnyPgColumn => expenses.expense_id),
}, (table) => [
  uniqueIndex('name_amount_date_repetition_idx').on(table.name, table.amount, table.date, table.repetition, table.user_id)
]);

export const expensesRelations = relations(expenses, ({ many, one }) => ({
  merged_expenses: many(expenses, {
    relationName: "merged_expenses"
  }),
  split_to_expenses: many(expenses, {
    relationName: "split_to_expenses"
  }),

  split_from_expense: one(expenses, {
    fields: [expenses.split_from],
    references: [expenses.expense_id],
    relationName: "split_to_expenses"

  }),
  merged_to_expense: one(expenses, {
    fields: [expenses.merged_to],
    references: [expenses.expense_id],
    relationName: "merged_expenses"
  }),

  user: one(users, {
    fields: [expenses.user_id],
    references: [users.user_id],
  }),
}));

