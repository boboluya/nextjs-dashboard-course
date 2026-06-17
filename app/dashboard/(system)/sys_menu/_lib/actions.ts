"use server";

import { SysMenu, SysMenuTree } from "@/app/lib/definitions";
import {
  selectMenus,
  selectTotal,
  insertMenu,
  updateMenu,
  softDeleteMenu,
  findMenuById,
  selectAllMenus,
} from "./repository";
import z from "zod";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApiPermission } from "@/lib/permission";

const FormSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Must be shorter than 50 characters" }),
  label: z
    .string()
    .min(1, { message: "Label is required." })
    .max(50, { message: "Must be shorter than 50 characters" }),
  path: z
    .string()
    .min(1, { message: "Path is required." })
    .max(255, { message: "Must be shorter than 255 characters" }),
  type: z.enum(["D", "M", "B", "F"], {
    invalid_type_error: "Please select a valid type.",
  }),
  parentId: z.coerce.number().nullable().optional(),
  sorting: z.coerce.number().min(0, { message: "Sorting must be >= 0" }),
  perms: z.string().max(255).optional().nullable(),
  status: z.coerce.number().min(0).max(1),
  hiding: z.coerce.number().min(0).max(1),
});

export type State = {
  errors?: {
    name?: string[];
    label?: string[];
    path?: string[];
    type?: string[];
    parentId?: string[];
    sorting?: string[];
    perms?: string[];
    status?: string[];
    hiding?: string[];
  };
  message?: string | null;
};

export type EditState = {
  errors?: {
    id?: string[];
    name?: string[];
    label?: string[];
    path?: string[];
    type?: string[];
    parentId?: string[];
    sorting?: string[];
    perms?: string[];
    status?: string[];
    hiding?: string[];
  };
  message?: string | null;
};

const CreateForm = FormSchema.omit({ id: true });
const EditForm = FormSchema;

export async function searchPages(sysMenu: SysMenu): Promise<SysMenu[]> {
  return await selectMenus(sysMenu);
}

export async function searchTotal(sysMenu: SysMenu): Promise<number> {
  return await selectTotal(sysMenu);
}

export async function createSysMenu(prevState: State, formData: FormData) {
  await hasApiPermission("system:sys_menu:add");

  const parsedData = CreateForm.safeParse({
    name: formData.get("name"),
    label: formData.get("label"),
    path: formData.get("path"),
    type: formData.get("type"),
    parentId: formData.get("parentId") || null,
    sorting: formData.get("sorting"),
    perms: formData.get("perms") || null,
    status: formData.get("status"),
    hiding: formData.get("hiding"),
  });
  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create.",
    };
  }
  const date = new Date();
  try {
    const menu: SysMenu = {
      name: parsedData.data.name,
      label: parsedData.data.label,
      path: parsedData.data.path,
      type: parsedData.data.type,
      parentId: parsedData.data.parentId ?? null,
      sorting: parsedData.data.sorting,
      perms: parsedData.data.perms ?? null,
      status: parsedData.data.status,
      hiding: parsedData.data.hiding,
      createTime: date,
      createBy: 1,
    };

    await insertMenu(menu);
  } catch (e) {
    console.log(e);
    throw error("Create failed.");
  }
  revalidatePath("/dashboard/sys_menu");
  redirect("/dashboard/sys_menu");
}

export async function fetchMenuById(id: number): Promise<SysMenu[]> {
  return await findMenuById(id);
}

/** Fetch all menus (no pagination) — for building tree structures. */
export async function fetchAllMenus(): Promise<SysMenu[]> {
  return await selectAllMenus();
}

/** Fetch all menus (no pagination) — for building tree structures. */
export async function fetchAllMenusTree(): Promise<SysMenuTree[]> {
  const menus = await fetchAllMenus();
  return buildMenuTree(menus);
}

/**
 * Build a hierarchical menu tree from a flat list of menus.
 * - Links children to their parents via parentId
 * - Sorts all levels by sorting field
 * - Handles orphaned menus (parent not found) by treating them as root items
 */
function buildMenuTree(menus: SysMenu[]): SysMenuTree[] {
  // Use a temporary map with sorting info for building the tree
  const tempMap: Record<number, SysMenu & { children: SysMenuTree[] }> = {};
  const rootMenus: SysMenuTree[] = [];

  // Step 1: Create a map of all menu items for O(1) lookup
  menus.forEach((menu) => {
    if (menu.id === undefined) return;
    tempMap[menu.id] = { ...menu, children: [] };
  });

  // Step 2: Build tree structure by linking children to parents
  menus.forEach((menu) => {
    if (menu.id === undefined) return;
    const menuItem = tempMap[menu.id];
    if (!menuItem) return;

    if (!menu.parentId || menu.parentId === 0) {
      // Root menu (no parent)
      rootMenus.push(menuItem);
    } else {
      const parentItem = tempMap[menu.parentId];
      if (parentItem) {
        // Found parent, add as child
        parentItem.children.push(menuItem);
      } else {
        // Parent not in list, treat as root menu to avoid orphans
        rootMenus.push(menuItem);
      }
    }
  });

  const sortTreeRecursively = (nodeList: SysMenuTree[]) => {
    if (!nodeList || nodeList.length === 0) return;

    nodeList.sort((a, b) => (a.sorting ?? 0) - (b.sorting ?? 0));

    nodeList.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortTreeRecursively(node.children);
      }
    });
  };

  sortTreeRecursively(rootMenus);

  return rootMenus;
}

export async function updateSysMenu(
  id: number,
  prevState: EditState,
  formData: FormData,
): Promise<EditState> {
  await hasApiPermission("system:sys_menu:edit");

  const parsedData = EditForm.safeParse({
    id: id,
    name: formData.get("name"),
    label: formData.get("label"),
    path: formData.get("path"),
    type: formData.get("type"),
    parentId: formData.get("parentId") || null,
    sorting: formData.get("sorting"),
    perms: formData.get("perms") || null,
    status: formData.get("status"),
    hiding: formData.get("hiding"),
  });
  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update.",
    };
  }
  try {
    const menu: SysMenu = {
      id: parsedData.data.id,
      name: parsedData.data.name,
      label: parsedData.data.label,
      path: parsedData.data.path,
      type: parsedData.data.type,
      parentId: parsedData.data.parentId ?? null,
      sorting: parsedData.data.sorting,
      perms: parsedData.data.perms ?? null,
      status: parsedData.data.status,
      hiding: parsedData.data.hiding,
    };
    await updateMenu(menu);
  } catch (e) {
    console.log(e);
    throw error("Update failed.");
  }
  revalidatePath("/dashboard/sys_menu");
  redirect("/dashboard/sys_menu");
}

export async function deleteMenu(id: number) {
  await hasApiPermission("system:sys_menu:delete");

  try {
    await softDeleteMenu(id);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/dashboard/sys_menu");
}
