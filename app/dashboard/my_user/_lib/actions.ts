"use server";

import { z } from "zod";
import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "./my_data";

const createMyUserSchema = z.object({
  userId: z.string().min(7),
  userName: z.string().min(7),
  nickName: z.string().min(2),
});

const updateMyUserSchema = z.object({
  userId: z.string().min(7),
  userName: z.string().min(7),
  nickName: z.string().min(2),
});


export async function createMyUser(data: FormData) {
  console.log(data);
  const rawData = Object.fromEntries(data.entries());
  const { userId, userName, nickName } = createMyUserSchema.parse(rawData);
  const date = new Date().toISOString().split("T")[0];
  const createUser = 1;
  await sql`
    INSERT INTO sys_user (user_id, user_name, nick_name, create_time, create_by)
    VALUES (${userId}, ${userName}, ${nickName}, ${date}, ${createUser})
  `;
  revalidatePath("/dashboard/my_user");
  redirect("/dashboard/my_user");
}

export async function selectUserById(id: string): Promise<User> {
  const user = await sql<User[]>`
    SELECT user_id as userId,
    user_name as userName,
    nick_name as nickName,
    create_time as createTime,
    update_time as updateTime
    FROM sys_user WHERE user_id = ${id}
  `;
  console.log(user);
  return user[0];
}

export async function updateMyUser(id: string, data: FormData) {
  console.log(data);
  const rawData = Object.fromEntries(data.entries());
  const { userName, nickName } = updateMyUserSchema.parse(rawData);
  const date = new Date().toISOString().split("T")[0];
  const updateUser = 1;
  await sql`
    UPDATE sys_user
    SET user_name = ${userName}, nick_name = ${nickName}, update_time = ${date}, update_by = ${updateUser}
    WHERE user_id = ${id}
  `;
  revalidatePath("/dashboard/my_user");
  redirect("/dashboard/my_user");
}

export async function selectTotalPages(pageSize: number, query: string): Promise<number> {
  const total = await sql`
    SELECT COUNT(*) FROM sys_user WHERE nick_name LIKE ${`%${query}%`}
  `;
  console.log(total)
  return Math.ceil(Number(total[0].count) / pageSize);
}

export async function deleteMyUser(id: string) {
  await sql`
    DELETE FROM sys_user WHERE user_id = ${id}
  `;
  revalidatePath("/dashboard/my_user");
}
