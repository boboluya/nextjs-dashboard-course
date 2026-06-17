"use server";
import { db } from "@/src/index";
import { sys_menuTable } from "@/src/db/schema";
import { eq, and, like, or, isNull, ne } from "drizzle-orm";
import { SysMenu } from "@/app/lib/definitions";
import { PageParams } from "./type";

function dbMapping(menu: typeof sys_menuTable.$inferSelect): SysMenu {
  return {
    id: menu.id ?? undefined,
    path: menu.path ?? undefined,
    type: menu.type ?? undefined,
    parentId: menu.parent_id ?? null,
    sorting: menu.sorting ?? undefined,
    name: menu.name ?? undefined,
    label: menu.label ?? undefined,
    perms: menu.perms ?? null,
    status: menu.status ?? undefined,
    hiding: menu.hiding ?? undefined,
    createTime: menu.create_time ?? undefined,
    createBy: menu.create_by ?? undefined,
    updateTime: menu.update_time ?? undefined,
    updateBy: menu.update_by ?? undefined,
    delFlag: menu.del_flag ?? null,
  };
}

export async function findMenuById(id: number): Promise<SysMenu[]> {
  const result = await db
    .select()
    .from(sys_menuTable)
    .where(
      and(
        eq(sys_menuTable.id, id),
        or(isNull(sys_menuTable.del_flag), eq(sys_menuTable.del_flag, "0"))
      ),
    );
  return result.map(dbMapping);
}

export async function selectMenus(sysMenu: PageParams): Promise<SysMenu[]> {
  const conditions = [
    sysMenu.id ? eq(sys_menuTable.id, sysMenu.id) : undefined,
    sysMenu.name ? like(sys_menuTable.name, `%${sysMenu.name}%`) : undefined,
    sysMenu.label ? like(sys_menuTable.label, `%${sysMenu.label}%`) : undefined,
    sysMenu.type ? eq(sys_menuTable.type, sysMenu.type) : undefined,
    sysMenu.status !== undefined && sysMenu.status !== null
      ? eq(sys_menuTable.status, sysMenu.status)
      : undefined,
    sysMenu.perms ? like(sys_menuTable.perms, `%${sysMenu.perms}%`) : undefined,
    sysMenu.delFlag ? eq(sys_menuTable.del_flag, sysMenu.delFlag) : undefined,
    ne(sys_menuTable.del_flag, "2"),
  ];
  const result = await db
    .select()
    .from(sys_menuTable)
    .where(
      conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined,
    )
    .limit(Number(sysMenu.pageSize))
    .offset((Number(sysMenu.pageNum) - 1) * Number(sysMenu.pageSize));
  return result.map(dbMapping);
}

export async function selectTotal(sysMenu: PageParams): Promise<number> {
  const conditions = [
    sysMenu.id ? eq(sys_menuTable.id, sysMenu.id) : undefined,
    sysMenu.name ? like(sys_menuTable.name, `%${sysMenu.name}%`) : undefined,
    sysMenu.label ? like(sys_menuTable.label, `%${sysMenu.label}%`) : undefined,
    sysMenu.type ? eq(sys_menuTable.type, sysMenu.type) : undefined,
    sysMenu.status !== undefined && sysMenu.status !== null
      ? eq(sys_menuTable.status, sysMenu.status)
      : undefined,
    sysMenu.perms ? like(sys_menuTable.perms, `%${sysMenu.perms}%`) : undefined,
    ne(sys_menuTable.del_flag, "2"),
  ].filter(Boolean);
  const result = await db.$count(
    sys_menuTable,
    conditions.length > 0 ? and(...conditions) : undefined,
  );
  return Math.ceil(result / Number(sysMenu.pageSize));
}

export async function insertMenu(menu: SysMenu) {
  const newMenu = await db
    .insert(sys_menuTable)
    .values({
      path: menu.path ?? "",
      type: menu.type ?? "M",
      parent_id: menu.parentId ?? null,
      sorting: menu.sorting ?? 0,
      name: menu.name ?? "",
      label: menu.label ?? "",
      perms: menu.perms ?? null,
      status: menu.status ?? 0,
      hiding: menu.hiding ?? 0,
      create_by: menu.createBy ?? 1,
      create_time: menu.createTime ?? new Date(),
      update_by: menu.updateBy ?? 1,
      update_time: new Date(),
    })
    .returning();
}

export async function updateMenu(menu: SysMenu) {
  const updateData: Record<string, unknown> = {
    update_by: menu.updateBy ?? 1,
    update_time: new Date(),
  };
  if (menu.path !== undefined) updateData.path = menu.path;
  if (menu.type !== undefined) updateData.type = menu.type;
  if (menu.parentId !== undefined) updateData.parent_id = menu.parentId;
  if (menu.sorting !== undefined) updateData.sorting = menu.sorting;
  if (menu.name !== undefined) updateData.name = menu.name;
  if (menu.label !== undefined) updateData.label = menu.label;
  if (menu.perms !== undefined) updateData.perms = menu.perms;
  if (menu.status !== undefined) updateData.status = menu.status;
  if (menu.hiding !== undefined) updateData.hiding = menu.hiding;

  await db
    .update(sys_menuTable)
    .set(updateData)
    .where(eq(sys_menuTable.id, menu.id!));
}

export async function softDeleteMenu(id: number) {
  await db
    .update(sys_menuTable)
    .set({ del_flag: "2" })
    .where(eq(sys_menuTable.id, id));
}

/** Fetch all non-deleted menus (no pagination) — for building trees. */
export async function selectAllMenus(): Promise<SysMenu[]> {
  const result = await db
    .select()
    .from(sys_menuTable)
    .where(
      or(
        isNull(sys_menuTable.del_flag),
        eq(sys_menuTable.del_flag, "0"),
        ne(sys_menuTable.del_flag, "2"),
      ),
    );
  return result.map(dbMapping);
}
