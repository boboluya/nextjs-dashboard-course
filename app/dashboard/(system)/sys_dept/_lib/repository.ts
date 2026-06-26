"use server";

import { db } from "@/src/index";
import { sys_deptTable } from "@/src/db/schema";
import { eq, and, like, or, isNull, ne } from "drizzle-orm";
import { SysDept } from "@/app/lib/definitions";
import { PageParams } from "./type";

function dbMapping(dept: typeof sys_deptTable.$inferSelect): SysDept {
  return {
    id: dept.id ?? undefined,
    parentId: dept.parent_id ?? 0,
    ancestors: dept.ancestors ?? "",
    deptName: dept.dept_name ?? undefined,
    orderNum: dept.order_num ?? 0,
    leader: dept.leader ?? null,
    phone: dept.phone ?? null,
    email: dept.email ?? null,
    status: dept.status ?? "0",
  };
}

export async function findDeptById(id: number): Promise<SysDept[]> {
  const result = await db
    .select()
    .from(sys_deptTable)
    .where(eq(sys_deptTable.id, id));
  return result.map(dbMapping);
}

export async function selectDepts(sysDept: PageParams): Promise<SysDept[]> {
  const conditions = [
    sysDept.deptName
      ? like(sys_deptTable.dept_name, `%${sysDept.deptName}%`)
      : undefined,
    sysDept.leader
      ? like(sys_deptTable.leader, `%${sysDept.leader}%`)
      : undefined,
    sysDept.status !== undefined && sysDept.status !== null
      ? eq(sys_deptTable.status, sysDept.status)
      : undefined,
    or(isNull(sys_deptTable.del_flag), eq(sys_deptTable.del_flag, "0")),
  ];
  const result = await db
    .select()
    .from(sys_deptTable)
    .where(
      conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined,
    )
    .limit(Number(sysDept.pageSize))
    .offset((Number(sysDept.pageNum) - 1) * Number(sysDept.pageSize));
  return result.map(dbMapping);
}

export async function selectTotal(sysDept: PageParams): Promise<number> {
  const conditions = [
    sysDept.deptName
      ? like(sys_deptTable.dept_name, `%${sysDept.deptName}%`)
      : undefined,
    sysDept.leader
      ? like(sys_deptTable.leader, `%${sysDept.leader}%`)
      : undefined,
    sysDept.status !== undefined && sysDept.status !== null
      ? eq(sys_deptTable.status, sysDept.status)
      : undefined,
    or(isNull(sys_deptTable.del_flag), eq(sys_deptTable.del_flag, "0")),
  ].filter(Boolean);
  const result = await db.$count(
    sys_deptTable,
    conditions.length > 0 ? and(...conditions) : undefined,
  );
  return Math.ceil(result / Number(sysDept.pageSize));
}

export async function insertDept(dept: SysDept) {
  const date = new Date();
  const newDept = await db
    .insert(sys_deptTable)
    .values({
      parent_id: dept.parentId ?? 0,
      ancestors: dept.ancestors ?? "",
      dept_name: dept.deptName ?? "",
      order_num: dept.orderNum ?? 0,
      leader: dept.leader ?? null,
      phone: dept.phone ?? null,
      email: dept.email ?? null,
      status: dept.status ?? "0",
      create_by: 1,
      create_time: date,
      update_by: 1,
      update_time: date,
    })
    .returning();
  return newDept;
}

export async function updateDept(dept: SysDept) {
  const updateData: Record<string, unknown> = {
    update_by: 1,
    update_time: new Date(),
  };
  if (dept.parentId !== undefined) updateData.parent_id = dept.parentId;
  if (dept.ancestors !== undefined) updateData.ancestors = dept.ancestors;
  if (dept.deptName !== undefined) updateData.dept_name = dept.deptName;
  if (dept.orderNum !== undefined) updateData.order_num = dept.orderNum;
  if (dept.leader !== undefined) updateData.leader = dept.leader;
  if (dept.phone !== undefined) updateData.phone = dept.phone;
  if (dept.email !== undefined) updateData.email = dept.email;
  if (dept.status !== undefined) updateData.status = dept.status;

  await db
    .update(sys_deptTable)
    .set(updateData)
    .where(eq(sys_deptTable.id, dept.id!));
}

export async function softDeleteDept(id: number) {
  // Check if there are child departments
  const children = await db
    .select()
    .from(sys_deptTable)
    .where(
      and(
        eq(sys_deptTable.parent_id, id),
        or(isNull(sys_deptTable.del_flag), eq(sys_deptTable.del_flag, "0")),
      ),
    );
  if (children.length > 0) {
    throw new Error("Cannot delete department with child departments.");
  }
  await db
    .update(sys_deptTable)
    .set({ del_flag: "1" })
    .where(eq(sys_deptTable.id, id));
}

export async function selectAllDepts(): Promise<SysDept[]> {
  const result = await db
    .select()
    .from(sys_deptTable)
    .where(
      or(isNull(sys_deptTable.del_flag), eq(sys_deptTable.del_flag, "0")),
    );
  return result.map(dbMapping);
}
