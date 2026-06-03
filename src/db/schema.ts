import {
  bigint,
  bigserial,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users2", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const sys_usersTable = pgTable("sys_user", {
  user_id: bigserial({ mode: "number" }),
  dept_id: integer(),
  user_name: varchar({ length: 20 }).notNull(),
  nick_name: varchar({ length: 20 }).notNull(),
  email: varchar({ length: 50 }).unique(),
  phonenumber: varchar({ length: 20 }),
  sex: varchar({ length: 1 }),
  avatar: varchar({ length: 255 }),
  password: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 1 }),
  del_flag: varchar({ length: 1 }),
  login_ip: varchar({ length: 50 }),
  login_date: timestamp({ withTimezone: true }),
  create_dept: integer().notNull(),
  create_by: integer().notNull(),
  create_time: timestamp({ withTimezone: true }).notNull(),
  // update_dept: integer().notNull(),
  update_by: integer().notNull(),
  update_time: timestamp({ withTimezone: true }).notNull(),
  remark: varchar({ length: 255 }),
});
