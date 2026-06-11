"use server";

import { SysRole } from "@/app/lib/definitions";
import { selectRoles, selectTotal, insertRole, updateRole, softDeleteRole, findRoleById } from "./repository";
import z from "zod";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object(
  {
    id: z.number(),
    name: z.string().min(1, { message: "Name is required." })
      .max(50, { message: "Must be shorter than 50 characters" }),
    key: z.string().min(1, { message: "Key is required." })
      .max(50, { message: "Must be shorter than 50 characters" }),
    dataScope: z.coerce.number().min(1).max(6),
    status: z.coerce.number().min(1).max(2),
  },
)

export type State = {
  errors?: {
    name?: string[],
    key?: string[],
    dataScope?: string[],
    status?: string[],
  }
  , message?: string | null
}

export type EditState = {
  errors?: {
    id?: string[],
    name?: string[],
    key?: string[],
    dataScope?: string[],
    status?: string[],
  }
  , message?: string | null
}

const CreateForm = FormSchema.omit({ id: true })
const EditForm = FormSchema

export async function searchPages(sysRole: SysRole): Promise<SysRole[]> {
  return await selectRoles(sysRole);
}

export async function searchTotal(sysRole: SysRole): Promise<number> {
  return await selectTotal(sysRole);
}

export async function createSysRole(prevState: State, formData: FormData) {
  const parsedData = CreateForm.safeParse({
    name: formData.get("name"),
    key: formData.get("key"),
    dataScope: formData.get("dataScope"),
    status: formData.get("status"),
  })
  if (!parsedData.success) {
    console.log(parsedData.error)
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create.",
    };
  }
  const date = new Date();
  try {
    const role: SysRole = {
      name: parsedData.data.name,
      key: parsedData.data.key,
      dataScope: parsedData.data.dataScope,
      status: parsedData.data.status,
      createTime: date,
      createBy: 1,
    }

    await insertRole(role);
  } catch (e) {
    console.log(e)
    throw error("Create failed.")
  }
  revalidatePath("/sys_role")
  redirect("/sys_role")
}

export async function fetchRoleById(id: number): Promise<SysRole[]> {
  return await findRoleById(id);
}

export async function updateSysRole(id: number, prevState: EditState, formData: FormData): Promise<EditState> {
  const parsedData = EditForm.safeParse({
    id: id,
    name: formData.get("name"),
    key: formData.get("key"),
    dataScope: formData.get("dataScope"),
    status: formData.get("status"),
  })
  if (!parsedData.success) {
    console.log(parsedData.error)
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update.",
    };
  }
  try {
    const role: SysRole = {
      id: parsedData.data.id,
      name: parsedData.data.name,
      key: parsedData.data.key,
      dataScope: parsedData.data.dataScope,
      status: parsedData.data.status,
    }
    await updateRole(role);
  } catch (e) {
    console.log(e)
    throw error("Update failed.")
  }
  revalidatePath("/sys_role")
  redirect("/sys_role")
}

export async function deleteRole(id: number) {
  try {
    await softDeleteRole(id);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/sys_role");
}
