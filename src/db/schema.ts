import { pgTable, text, timestamp, uuid, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const folders = pgTable('folders', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  dept: text('dept').notNull(),
  year: integer('year').notNull(),
  batch: text('batch').notNull(),
  group_name: text('group_name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('name_idx').on(table.name)
]);

export const codeFiles = pgTable('code_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  folderId: uuid('folder_id').notNull().references(() => folders.id, { onDelete: 'cascade' }),
  heading: text('heading').notNull(),
  language: text('language').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const foldersRelations = relations(folders, ({ many }) => ({
  files: many(codeFiles),
}));

export const codeFilesRelations = relations(codeFiles, ({ one }) => ({
  folder: one(folders, {
    fields: [codeFiles.folderId],
    references: [folders.id],
  }),
}));
