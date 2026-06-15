"use server";

import { SysRole } from "@/app/lib/definitions";
import {
  selectRoles, selectTotal, insertRole, updateRole, softDeleteRole, findRoleById,
  findMenuIdsByRoleId, insertRoleMenus, deleteRoleMenus, selectAllMenus,
} from "./repository";
import z from "zod";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApiPermission } from "@/lib/permission";

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
  await hasApiPermission("system:sys_role:add");

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

  // Get menu ID list
  const menuIds = formData.getAll("menuIds").map(Number).filter((id) => !isNaN(id));

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

    const newRole = await insertRole(role);

    // If there are selected menus, insert role-menu associations
    if (newRole && newRole.length > 0 && menuIds.length > 0) {
      const roleId = newRole[0].id;
      await insertRoleMenus(roleId, menuIds);
    }
  } catch (e) {
    console.log(e)
    throw error("Create failed.")
  }
  revalidatePath("/dashboard/sys_role")
  redirect("/dashboard/sys_role")
}

export async function fetchRoleById(id: number): Promise<SysRole[]> {
  return await findRoleById(id);
}

export async function updateSysRole(id: number, prevState: EditState, formData: FormData): Promise<EditState> {
  await hasApiPermission("system:sys_role:edit");

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

  // Get menu ID list
  const menuIds = formData.getAll("menuIds").map(Number).filter((menuId) => !isNaN(menuId));

  try {
    const role: SysRole = {
      id: parsedData.data.id,
      name: parsedData.data.name,
      key: parsedData.data.key,
      dataScope: parsedData.data.dataScope,
      status: parsedData.data.status,
    }
    await updateRole(role);

    // Update role-menu associations: delete old ones first, then insert new ones
    await deleteRoleMenus(id);
    if (menuIds.length > 0) {
      await insertRoleMenus(id, menuIds);
    }
  } catch (e) {
    console.log(e)
    throw error("Update failed.")
  }
  revalidatePath("/dashboard/sys_role")
  redirect("/dashboard/sys_role")
}

export async function deleteRole(id: number) {
  await hasApiPermission("system:sys_role:delete");

  try {
    await softDeleteRole(id);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/dashboard/sys_role");
}

// ============ Role-Menu Actions ============

/**
 * Fetch the list of menu IDs associated with a given role
 */
export async function fetchMenuIdsByRoleId(roleId: number): Promise<number[]> {
  return await findMenuIdsByRoleId(roleId);
}

/**
 * Fetch all menus (used for building the menu tree)
 */
export async function fetchAllMenusForTree(): Promise<{ id: number; parentId: number | null; label: string }[]> {
  return await selectAllMenus();
}
