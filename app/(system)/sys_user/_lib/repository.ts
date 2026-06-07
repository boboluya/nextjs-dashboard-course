"use server";
import { db } from "@/src/index";
import { sys_usersTable } from "@/src/db/schema";
import { eq, and, like } from "drizzle-orm";
import { SysUser } from "@/app/lib/definitions";
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
