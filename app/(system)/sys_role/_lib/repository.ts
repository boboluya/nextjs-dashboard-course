"use server";
import { db } from "@/src/index";
import { sys_roleTable } from "@/src/db/schema";
import { eq, and, like, or, isNull } from "drizzle-orm";
import { SysRole } from "@/app/lib/definitions";
import { PageParams } from "./type";

function dbMapping(role: typeof sys_roleTable.$inferSelect): SysRole {
  return {
    id: role.id ?? undefined,
    name: role.name ?? undefined,
    key: role.key ?? undefined,
    dataScope: role.data_scope ?? undefined,
    status: role.status ?? undefined,
    createTime: role.create_time ?? undefined,
    createBy: role.create_by ?? undefined,
    updateTime: role.update_time ?? undefined,
    updateBy: role.update_by ?? undefined,
    delFlag: role.del_flag ?? null,
  };
}

export async function findRoleById(id: number): Promise<SysRole[]> {
  const result = await db
    .select()
    .from(sys_roleTable)
    .where(
      and(
        eq(sys_roleTable.id, id),
        or(isNull(sys_roleTable.del_flag), eq(sys_roleTable.del_flag, "0")),
      ),
    );
  return result.map(dbMapping);
}

export async function selectRoles(sysRole: PageParams): Promise<SysRole[]> {
  const conditions = [
    sysRole.id ? eq(sys_roleTable.id, sysRole.id) : undefined,
    sysRole.name
      ? like(sys_roleTable.name, `%${sysRole.name}%`)
      : undefined,
    sysRole.key
      ? like(sys_roleTable.key, `%${sysRole.key}%`)
      : undefined,
    sysRole.status !== undefined && sysRole.status !== null
      ? eq(sys_roleTable.status, sysRole.status)
      : undefined,
    sysRole.delFlag
      ? eq(sys_roleTable.del_flag, sysRole.delFlag)
      : undefined,
  ];
  const result = await db
    .select()
    .from(sys_roleTable)
    .where(
      conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined,
    )
    .limit(Number(sysRole.pageSize))
    .offset((Number(sysRole.pageNum) - 1) * Number(sysRole.pageSize));
  return result.map(dbMapping);
}

export async function selectTotal(sysRole: PageParams): Promise<number> {
  const conditions = [
    sysRole.id ? eq(sys_roleTable.id, sysRole.id) : undefined,
    sysRole.name
      ? like(sys_roleTable.name, `%${sysRole.name}%`)
      : undefined,
    sysRole.key
      ? like(sys_roleTable.key, `%${sysRole.key}%`)
      : undefined,
    sysRole.status !== undefined && sysRole.status !== null
      ? eq(sys_roleTable.status, sysRole.status)
      : undefined,
    sysRole.delFlag
      ? eq(sys_roleTable.del_flag, sysRole.delFlag)
      : undefined,
  ].filter(Boolean);
  const result = await db.$count(
    sys_roleTable,
    conditions.length > 0 ? and(...conditions) : undefined,
  );
  return Math.ceil(result / Number(sysRole.pageSize));
}

export async function insertRole(role: SysRole) {
  const newRole = await db.insert(sys_roleTable).values({
    name: role.name ?? "",
    key: role.key ?? "",
    data_scope: role.dataScope ?? 1,
    status: role.status ?? 1,
    create_by: role.createBy ?? 1,
    create_time: role.createTime ?? new Date(),
    update_by: role.updateBy ?? 1,
    update_time: new Date(),
  }).returning();
  console.log("新角色ID:", newRole);
}

export async function updateRole(role: SysRole) {
  await db
    .update(sys_roleTable)
    .set({
      name: role.name ?? "",
      key: role.key ?? "",
      data_scope: role.dataScope ?? 1,
      status: role.status ?? 1,
      update_by: role.updateBy ?? 1,
      update_time: new Date(),
    })
    .where(eq(sys_roleTable.id, role.id!));
}

export async function softDeleteRole(id: number) {
  await db
    .update(sys_roleTable)
    .set({ del_flag: "2" })
    .where(eq(sys_roleTable.id, id));
}
