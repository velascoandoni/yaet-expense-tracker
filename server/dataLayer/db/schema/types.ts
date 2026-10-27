import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const types = pgTable('types', {
  type_id: serial('type_id').primaryKey(),
  name: text('name').notNull(),
  emoji:text('emoji').notNull().default("❓"),
  color:text('color').notNull().default("#ffffffff"),
  text_color:text('text_color').notNull().default("#000000ff")
});


