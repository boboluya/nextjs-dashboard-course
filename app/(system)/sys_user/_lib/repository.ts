"use server"
import { db } from "@/src/index";
import { sys_usersTable } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { SysUser } from "@/app/lib/definitions";

function dbMapping(user: typeof sys_usersTable.$inferSelect): SysUser {
  return {
    userId: user.user_id ?? undefined,
    deptId: user.dept_id ?? null,
    userName: user.user_name ?? null,
    nickName: user.nick_name ?? null,
    email: String(user.email) ?? null,
    phoneNumber: String(user.phone_number) ?? null,
    sex: user.sex ?? null,
    avatar: user.avatar ?? null,
    password: user.password ?? null,
    status: user.status ?? null,
    deletedFlag: user.del_flag ?? null,
    loginIp: user.login_ip ?? null,
    loginDatetime: user.login_datetime ?? null,
    createDept: user.create_dept ?? null,
    createBy: user.create_by ?? null,
    createTime: user.create_time ?? null,
    updateDept: user.update_dept ?? null,
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

export async function selectUsers(sysUser: SysUser): Promise<SysUser[]> {
  const conditions = [
    sysUser.userId ? eq(sys_usersTable.user_id, sysUser.userId) : undefined,
    sysUser.deptId ? eq(sys_usersTable.dept_id, sysUser.deptId) : undefined,
    sysUser.userName
      ? eq(sys_usersTable.user_name, sysUser.userName)
      : undefined,
    sysUser.nickName
      ? eq(sys_usersTable.nick_name, sysUser.nickName)
      : undefined,
    sysUser.email ? eq(sys_usersTable.email, sysUser.email) : undefined,
    sysUser.phoneNumber
      ? eq(sys_usersTable.phonenumber, sysUser.phoneNumber)
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
    );
  return result.map(dbMapping);
}
