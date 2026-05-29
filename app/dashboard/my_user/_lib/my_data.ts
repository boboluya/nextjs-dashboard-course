import "server-only";
import postgres from "postgres";

const db_url = process.env.POSTGRES_URL;

if (!db_url) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const db = postgres(db_url, { ssl: false });

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
  const result = await db<User[]>`SELECT user_id as userId,
  user_name as userName, nick_name as nickName,
  create_by as createBy, update_by as updateBy,
  create_time as createTime, update_time as updateTime
  FROM sys_user WHERE nick_name LIKE ${`%${queryName}%`}
  ORDER BY create_time DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
  return result;
}
