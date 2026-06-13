"use server";
import { db } from "@/src/index";
import { sys_usersTable, sys_userRoleTable, sys_roleTable } from "@/src/db/schema";
import { eq, and, like, inArray, or, isNull, ne } from "drizzle-orm";
import { SysUser, SysRole } from "@/app/lib/definitions";
import { PageParams } from "./type";

function dbMapping(user: typeof sys_usersTable.$inferSelect): SysUser {
  return {
    userId: user.user_id ?? undefined,
    deptId: user.dept_id ?? null,
    userName: user.user_name ?? null,
    nickName: user.nick_name ?? null,
    email: String(user.email) ?? null,
    phoneNumber: String(user.phonenumber) ?? null,
    sex: user.sex ?? null,
    avatar: user.avatar ?? null,
    password: user.password ?? null,
    status: user.status ?? null,
    deletedFlag: user.del_flag ?? null,
    loginIp: user.login_ip ?? null,
    loginDate: user.login_date ?? null,
    createDept: user.create_dept ?? null,
    createBy: user.create_by ?? null,
    createTime: user.create_time ?? null,
    updateBy: user.update_by ?? null,
    updateTime: user.update_time ?? null,
    remark: user.remark ?? null,
  };
}

export async function findUserById(id: number): Promise<SysUser[]> {
  const result = await db
    .select()
    .from(sys_usersTable)
    .where(
      and(
        eq(sys_usersTable.user_id, id),
        eq(sys_usersTable.del_flag, "0"),
        eq(sys_usersTable.status, "0"),
      ),
    );
  return result.map(dbMapping);
}

export async function selectUsers(sysUser: PageParams): Promise<SysUser[]> {
  const conditions = [
    sysUser.userId ? eq(sys_usersTable.user_id, sysUser.userId) : undefined,
    sysUser.deptId ? eq(sys_usersTable.dept_id, sysUser.deptId) : undefined,
    sysUser.userName
      ? like(sys_usersTable.user_name, `%${sysUser.userName}%`)
      : undefined,
    sysUser.nickName
      ? like(sys_usersTable.nick_name, `%${sysUser.nickName}%`)
      : undefined,
    sysUser.email ? eq(sys_usersTable.email, sysUser.email) : undefined,
    sysUser.phoneNumber
      ? like(sys_usersTable.phonenumber, sysUser.phoneNumber)
      : undefined,
    sysUser.sex ? eq(sys_usersTable.sex, sysUser.sex) : undefined,
    sysUser.avatar ? eq(sys_usersTable.avatar, sysUser.avatar) : undefined,
    sysUser.status ? eq(sys_usersTable.status, sysUser.status) : undefined,
    sysUser.deletedFlag
      ? eq(sys_usersTable.del_flag, sysUser.deletedFlag)
      : undefined,
    ne(sys_usersTable.del_flag, "2"),
  ];
  const result = await db
    .select()
    .from(sys_usersTable)
    .where(
      conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined,
    )
    .limit(Number(sysUser.pageSize))
    .offset((Number(sysUser.pageNum) - 1) * Number(sysUser.pageSize));
  return result.map(dbMapping);
}

export async function selectTotal(sysUser: PageParams): Promise<number> {
  const conditions = [
    sysUser.userId ? eq(sys_usersTable.user_id, sysUser.userId) : undefined,
    sysUser.deptId ? eq(sys_usersTable.dept_id, sysUser.deptId) : undefined,
    sysUser.userName
      ? like(sys_usersTable.user_name, `%${sysUser.userName}%`)
      : undefined,
    sysUser.nickName
      ? like(sys_usersTable.nick_name, `%${sysUser.nickName}%`)
      : undefined,
    sysUser.email ? eq(sys_usersTable.email, sysUser.email) : undefined,
    sysUser.phoneNumber
      ? like(sys_usersTable.phonenumber, `%${sysUser.phoneNumber}%`)
      : undefined,
    sysUser.sex ? eq(sys_usersTable.sex, sysUser.sex) : undefined,
    sysUser.status ? eq(sys_usersTable.status, sysUser.status) : undefined,
    sysUser.deletedFlag
      ? eq(sys_usersTable.del_flag, sysUser.deletedFlag)
      : undefined,
    ne(sys_usersTable.del_flag, "2"),
  ].filter(Boolean);
  const result = await db.$count(
    sys_usersTable,
    conditions.length > 0 ? and(...conditions) : undefined,
  );
  return Math.ceil(result / Number(sysUser.pageSize));
}
type InsertUser = typeof sys_usersTable.$inferInsert;

export async function insertUser(user: SysUser) {
  const newUser = await db.insert(sys_usersTable).values({
    user_name: user.userName ?? "",
    nick_name: user.nickName ?? "",
    password: user.password ?? "",
    create_dept: user.deptId ?? 0,
    create_by: 1,
    create_time: user.createTime ?? new Date(),
    update_by: 1,
    update_time: new Date(),
    email: user.email ?? null,
    phonenumber: user.phoneNumber ?? null,
    sex: user.sex ?? "0",
  }).returning();
  console.log("新用户ID:", newUser);
  return newUser;
}

export async function updateUser(user: SysUser) {
  await db
    .update(sys_usersTable)
    .set({
      user_name: user.userName ?? "",
      nick_name: user.nickName ?? "",
      password: user.password ?? "",
      email: user.email ?? null,
      phonenumber: user.phoneNumber ?? null,
      sex: user.sex ?? "0",
      update_by: 1,
      update_time: new Date(),
    })
    .where(eq(sys_usersTable.user_id, user.userId!));
}

export async function softDeleteUser(userId: number) {
  await db
    .update(sys_usersTable)
    .set({ del_flag: "2" })
    .where(eq(sys_usersTable.user_id, userId));
}

export async function resetUserPassword(userId: number, hashedPassword: string) {
  await db
    .update(sys_usersTable)
    .set({
      password: hashedPassword,
      update_by: 1,
      update_time: new Date(),
    })
    .where(eq(sys_usersTable.user_id, userId));
}

// ============ User-Role Management ============

export async function findRolesByUserId(userId: number): Promise<number[]> {
  const result = await db
    .select({ roleId: sys_userRoleTable.role_id })
    .from(sys_userRoleTable)
    .innerJoin(sys_roleTable, eq(sys_userRoleTable.role_id, sys_roleTable.id))
    .where(
      and(
        eq(sys_userRoleTable.user_id, userId),
        or(isNull(sys_roleTable.del_flag), eq(sys_roleTable.del_flag, "0")),
      ),
    );
  return result.map((r) => r.roleId);
}

export async function selectAllRoles(): Promise<SysRole[]> {
  const result = await db
    .select()
    .from(sys_roleTable)
    .where(eq(sys_roleTable.del_flag, "0"));
  return result.map((role) => ({
    id: role.id ?? undefined,
    name: role.name ?? undefined,
    key: role.key ?? undefined,
    dataScope: role.data_scope ?? undefined,
    status: role.status ?? undefined,
    createTime: role.create_time ?? undefined,
    createBy: role.create_by ?? undefined,
    updateTime: role.update_time ?? undefined,
    updateBy: role.update_by ?? undefined,
    delFlag: role.del_flag ?? null,
  }));
}

export async function insertUserRole(userId: number, roleIds: number[]) {
  if (roleIds.length === 0) return;
  await db.insert(sys_userRoleTable).values(
    roleIds.map((roleId) => ({
      user_id: userId,
      role_id: roleId,
    })),
  );
}

export async function deleteUserRoles(userId: number) {
  await db
    .delete(sys_userRoleTable)
    .where(eq(sys_userRoleTable.user_id, userId));
}

/**
 * Fetch role names for multiple user IDs in one query.
 * Returns a Map<userId, roleName[]>.
 */
export async function findRoleNamesByUserIds(
  userIds: number[],
): Promise<Map<number, string[]>> {
  if (userIds.length === 0) return new Map();
  const result = await db
    .select({
      userId: sys_userRoleTable.user_id,
      roleName: sys_roleTable.name,
    })
    .from(sys_userRoleTable)
    .innerJoin(sys_roleTable, eq(sys_userRoleTable.role_id, sys_roleTable.id))
    .where(
      and(
        inArray(sys_userRoleTable.user_id, userIds),
        eq(sys_roleTable.del_flag, "0"),
      ),
    );

  const map = new Map<number, string[]>();
  for (const row of result) {
    if (!map.has(row.userId)) {
      map.set(row.userId, []);
    }
    map.get(row.userId)!.push(row.roleName);
  }
  return map;
}
