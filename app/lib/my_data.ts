
import { db } from "@/src/index";
import { sql } from "drizzle-orm";

type User = {
  userId: number;
  userName: string;
  nickName: string;
  createBy: number;
  updateBy: number;
};

export async function getTenUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = await db.execute(sql<User[]>`SELECT user_id as "userId",
  user_name as "userName", nick_name as "nickName",
  create_by as "createBy", update_by as "updateBy" FROM sys_user LIMIT 10`);
  return result.rows as User[];
}
