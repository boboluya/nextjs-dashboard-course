import "server-only";
import { db } from "@/src/index";
import { sql } from "drizzle-orm";

export type User = {
  userId: number;
  userName: string;
  nickName: string;
  createBy: number;
  updateBy: number;
  createTime: string;
  updateTime: string;
};

export async function getTenUsers(
  queryName: string,
  page: number,
  pageSize: number,
): Promise<User[]> {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = await db.execute(sql`SELECT
    user_id as "userId",
    user_name as "userName",
    nick_name as "nickName",
    create_by as "createBy",
    update_by as "updateBy",
    create_time as "createTime",
    update_time as "updateTime"
    FROM sys_user
    WHERE nick_name LIKE ${`%${queryName}%`}
    ORDER BY create_time DESC
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`);
  return result.rows as User[];
}
