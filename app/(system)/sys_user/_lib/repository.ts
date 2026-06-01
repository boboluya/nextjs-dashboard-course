import { db } from "@/src/index";
import { sys_usersTable } from "@/src/db/schema";
import { eq ,and} from "drizzle-orm";
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
        eq(sys_usersTable.del_flag, '0'),
        eq(sys_usersTable.status, '0')
      )
    );
  return result.map(dbMapping);
}
