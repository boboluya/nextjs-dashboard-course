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
  user_id: bigserial({ mode: "number" }).primaryKey(),
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
  update_by: integer().notNull(),
  update_time: timestamp({ withTimezone: true }).notNull(),
  remark: varchar({ length: 255 }),
});

/**
 * sys_menuTable - menu table
 */
export const sys_menuTable = pgTable("sys_menu", {
  /** menu_id */
  id: bigserial({ mode: "number" }).primaryKey(),
  /** file_path */
  path: varchar({ length: 255 }).notNull(),
  /** menu_type: D:dir, M:menu, B:button, F:file */
  type: varchar({ length: 1 }).notNull(),
  /** parent_id */
  parent_id: bigint({ mode: "number" }),
  /** sorting */
  sorting: integer().notNull(),
  /** name */
  name: varchar({ length: 255 }).notNull(),
  /** label */
  label: varchar({ length: 255 }).notNull(),
  /** perms */
  perms: varchar({ length: 255 }),
  /** status */
  status: integer().notNull(),
  /** hiding */
  hiding: integer().notNull(),
  /** create_time */
  create_time: timestamp({ withTimezone: true }).notNull(),
  /** create_by */
  create_by: integer().notNull(),
  /** update_time */
  update_time: timestamp({ withTimezone: true }).notNull(),
  /** update_by */
  update_by: integer().notNull(),
  /** del_flag */
  del_flag: varchar({ length: 1 }),
});

/**
 * sys_roleTable - role table
 */ export const sys_roleTable = pgTable("sys_role", {
  /** role_id */
  id: bigserial({ mode: "number" }).primaryKey(),
  /** role_name */
  name: varchar({ length: 255 }).notNull(),
  /** role_key */
  key: varchar({ length: 255 }).notNull(),
  /** data_scope
   * 1: All data permissions;
   * 2: Custom data permissions;
   * 3: Data permissions for this department;
   * 4: Data permissions for this department and below;
   * 5: Data permissions for myself only;
   * 6: Data permissions for this department and below or for myself
   */
  data_scope: integer().notNull(),
  /** status
   * 1: Normal; 2: Disabled
   */
  status: integer().notNull(),
  /** create_time */
  create_time: timestamp({ withTimezone: true }).notNull(),
  /** create_by */
  create_by: integer().notNull(),
  /** update_time */
  update_time: timestamp({ withTimezone: true }).notNull(),
  /** update_by */
  update_by: integer().notNull(),
  /** del_flag
   * 0: Not deleted; 1: Deleted
   */
  del_flag: varchar({ length: 1 }).default('0'),
});
