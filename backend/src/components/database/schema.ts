import { pgTable, serial, text, boolean } from 'drizzle-orm/pg-core';

export enum BlogStatus {
    UNINITIALIZED = 'UN',
    DEPLOYING = 'IP',
    DEPLOYED = 'CP',
    FAILED = 'FA',
}

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
    hasBlog: boolean('hasBlog').notNull().default(false),
    blogStatus: text('blog_status').notNull().default(BlogStatus.UNINITIALIZED),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: serial('user_id')
        .notNull()
        .references(() => users.id),
});

export const tokens = pgTable('tokens', {
    id: serial('id').primaryKey(),
    token: text('token').notNull(),
    userId: serial('user_id')
        .notNull()
        .references(() => users.id),
    expired: boolean('expired').notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;
