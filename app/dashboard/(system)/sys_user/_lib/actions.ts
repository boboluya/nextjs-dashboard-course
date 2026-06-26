"use server";

import { SysUser } from "@/app/lib/definitions";
import { selectUsers, selectTotal, insertUser, updateUser, softDeleteUser, findUserById, resetUserPassword, findRolesByUserId, selectAllRoles, insertUserRole, deleteUserRoles, findRoleNamesByUserIds } from "./repository";
import { SysRole } from "@/app/lib/definitions";
import { fetchAllDeptsForTree as fetchAllDepts } from "@/app/dashboard/(system)/sys_dept/_lib/actions";
import z from "zod";
import bcrypt from "bcrypt";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApiPermission } from "@/lib/permission";

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

export type EditState = {
  errors?: {
    userId?: string[],
    userName?: string[],
    nickName?: string[],
    email?: string[],
    sex?: string[],
    phonenumber?: string[],
  }
  , message?: string|null
}

const CreateForm = FormSchema.omit({ userId: true })
const EditForm = FormSchema.omit({ password: true })

export async function searchPages(sysUser: SysUser): Promise<SysUser[]> {
  return await selectUsers(sysUser);
}

export async function searchTotal(sysUser: SysUser): Promise<number> {
  return await selectTotal(sysUser);
}

export async function createSysUser(prevState: State, formData: FormData) {
  await hasApiPermission("system:sys_user:add");

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
  const roleIds = formData.getAll("roleIds").map(Number).filter((id) => !isNaN(id));
  const deptId = formData.get("deptId") ? Number(formData.get("deptId")) : null;
  const date = new Date();
  const bcryptedPw = await bcrypt.hash(parsedData.data.password, 10)
  try {
    const user: SysUser = {
      userName: parsedData.data.userName,
      nickName: parsedData.data.nickName,
      email: parsedData.data.email,
      sex: parsedData.data.sex,
      phoneNumber: String(parsedData.data.phonenumber),
      deptId: deptId,
      createTime: date,
      password: bcryptedPw,
    }

    const newUser = await insertUser(user);
    // Assign roles if provided
    if (roleIds.length > 0 && newUser && newUser[0]) {
      await insertUserRole(newUser[0].user_id, roleIds);
    }
  } catch (e) {
    console.log(e)
    throw error("Create failed.")
  }
  revalidatePath("/dashboard/sys_user")
  redirect("/dashboard/sys_user")
}

export async function fetchUserById(userId: number): Promise<SysUser[]> {
  return await findUserById(userId);
}

export async function fetchRolesByUserId(userId: number): Promise<number[]> {
  return await findRolesByUserId(userId);
}

export async function fetchAllRoles(): Promise<SysRole[]> {
  return await selectAllRoles();
}

export async function fetchRoleNamesByUserIds(
  userIds: number[],
): Promise<Record<number, string[]>> {
  const map = await findRoleNamesByUserIds(userIds);
  return Object.fromEntries(map);
}

export async function fetchAllDeptsForTree(): Promise<
  { id: number; parentId: number; label: string }[]
> {
  return await fetchAllDepts();
}

export async function updateSysUser(userId: number, prevState: EditState, formData: FormData): Promise<EditState> {
  await hasApiPermission("system:sys_user:edit");

  const parsedData = EditForm.safeParse({
    userId: userId,
    userName: formData.get("userName"),
    nickName: formData.get("nickName"),
    email: formData.get("email"),
    sex: formData.get("sex"),
    phonenumber: formData.get("phonenumber"),
  })
  if (!parsedData.success) {
    console.log(parsedData.error)
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update.",
    };
  }
  const roleIds = formData.getAll("roleIds").map(Number).filter((id) => !isNaN(id));
  const deptId = formData.get("deptId") ? Number(formData.get("deptId")) : null;
  try {
    const user: SysUser = {
      userId: parsedData.data.userId,
      userName: parsedData.data.userName,
      nickName: parsedData.data.nickName,
      email: parsedData.data.email,
      sex: parsedData.data.sex,
      phoneNumber: String(parsedData.data.phonenumber),
      deptId: deptId,
    }
    await updateUser(user);
    // Update roles: delete existing, insert new
    await deleteUserRoles(userId);
    if (roleIds.length > 0) {
      await insertUserRole(userId, roleIds);
    }
  } catch (e) {
    console.log(e)
    throw error("Update failed.")
  }
  revalidatePath("/dashboard/sys_user")
  redirect("/dashboard/sys_user")
}

export async function deleteUser(userId: number) {
  await hasApiPermission("system:sys_user:delete");

  try {
    await softDeleteUser(userId);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/dashboard/sys_user");
}

export type ResetPasswordState = {
  errors?: {
    password?: string[];
  };
  message?: string | null;
};

const ResetPasswordSchema = z.object({
  password: z.string().min(6, { message: "At least 6 characters" }),
});

export async function resetPassword(userId: number, prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  await hasApiPermission("system:sys_user:resetpwd");

  const parsedData = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }
  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    await resetUserPassword(userId, hashedPassword);
  } catch (e) {
    console.log(e);
    return { message: "Failed to reset password." };
  }
  revalidatePath("/dashboard/sys_user");
  return { message: null };
}
