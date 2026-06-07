"use server";

import { SysUser } from "@/app/lib/definitions";
import { selectUsers, selectTotal, insertUser, softDeleteUser } from "./repository";
import z from "zod";
import bcrypt from "bcrypt";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object(
  {
    userId: z.number(),
    userName: z.string().min(5, { message: "5 charactors at least." })
      .max(10, { message: "must short than 10 charactors" }),
    nickName: z.string().min(5, { message: "5 charactors at least." })
      .max(10, { message: "must short than 10 charactors" }),
    email: z.string().email(),
    sex: z.enum(["1", "2"], { invalid_type_error: "Please select a right option." }),
    phonenumber: z.coerce.number(),
    password: z.string().min(6, { message: "At least 6 chrs" })
  },
)

export type State = {
  errors?: {
    userName?: string[],
    nickName?: string[],
    email?: string[],
    sex?: string[],
    phonenumber?: string[],
    password?: string[]
  }
  , message?: string|null
}

const CreateForm = FormSchema.omit({ userId: true })

export async function searchPages(sysUser: SysUser): Promise<SysUser[]> {
  return await selectUsers(sysUser);
}

export async function searchTotal(sysUser: SysUser): Promise<number> {
  return await selectTotal(sysUser);
}

export async function createSysUser(prevState: State, formData: FormData) {
  const parsedData = CreateForm.safeParse({
    userName: formData.get("userName"),
    nickName: formData.get("nickName"),
    email: formData.get("email"),
    sex: formData.get("sex"),
    phonenumber: formData.get("phonenumber"),
    password: formData.get("password"),
  })
  if (!parsedData.success) {
    console.log(parsedData.error)
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create.",
    };
  }
  const date = new Date();
  const bcryptedPw = await bcrypt.hash(parsedData.data.password, 10)
  try {
    const user: SysUser = {
      userName: parsedData.data.userName,
      nickName: parsedData.data.nickName,
      email: parsedData.data.email,
      sex: parsedData.data.sex,
      phoneNumber: String(parsedData.data.phonenumber),
      createTime: date,
      password: bcryptedPw,
    }

    await insertUser(user);
  } catch (e) {
    console.log(e)
    throw error("Create failed.")
  }
  revalidatePath("/sys_user")
  redirect("/sys_user")
}

export async function deleteUser(userId: number) {
  try {
    await softDeleteUser(userId);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/sys_user");
}
