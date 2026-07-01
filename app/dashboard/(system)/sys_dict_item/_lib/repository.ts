"use server";
import { db } from "@/src/index";
import { sys_dictItemTable, sys_dictTypeTable } from "@/src/db/schema";
import { eq, and, like, ne } from "drizzle-orm";
import { SysDictItem } from "@/app/lib/definitions";
import { PageParams } from "./type";

function dbMapping(row: typeof sys_dictItemTable.$inferSelect): SysDictItem {
  return {
    id: row.id ?? undefined,
    dictTypeId: row.dict_type_id ?? undefined,
    dictName: row.dict_name ?? undefined,
    dictValue: row.dict_value ?? undefined,
    dictLabel: row.dict_label ?? undefined,
    sorting: row.sorting ?? undefined,
    color: row.color ?? undefined,
    createBy: row.create_by ?? undefined,
    updateBy: row.update_by ?? undefined,
    delFlag: row.del_flag ?? null,
    createTime: row.create_time ?? undefined,
    updateTime: row.update_time ?? undefined,
  };
}

export async function findDictItemById(id: number): Promise<SysDictItem[]> {
  const result = await db
    .select()
    .from(sys_dictItemTable)
    .where(
      and(
        eq(sys_dictItemTable.id, id),
        eq(sys_dictItemTable.del_flag, "0"),
      ),
    );
  return result.map(dbMapping);
}

export async function selectDictItems(params: PageParams): Promise<SysDictItem[]> {
  const conditions = [
    params.dictName
      ? like(sys_dictItemTable.dict_name, `%${params.dictName}%`)
      : undefined,
    params.dictValue
      ? like(sys_dictItemTable.dict_value, `%${params.dictValue}%`)
      : undefined,
    params.dictLabel
      ? like(sys_dictItemTable.dict_label, `%${params.dictLabel}%`)
      : undefined,
    params.dictTypeId
      ? eq(sys_dictItemTable.dict_type_id, params.dictTypeId)
      : undefined,
    ne(sys_dictItemTable.del_flag, "2"),
  ];
  const result = await db
    .select()
    .from(sys_dictItemTable)
    .where(
      conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined,
    )
    .limit(Number(params.pageSize))
    .offset((Number(params.pageNum) - 1) * Number(params.pageSize));
  return result.map(dbMapping);
}

export async function selectDictItemTotal(params: PageParams): Promise<number> {
  const conditions = [
    params.dictName
      ? like(sys_dictItemTable.dict_name, `%${params.dictName}%`)
      : undefined,
    params.dictValue
      ? like(sys_dictItemTable.dict_value, `%${params.dictValue}%`)
      : undefined,
    params.dictLabel
      ? like(sys_dictItemTable.dict_label, `%${params.dictLabel}%`)
      : undefined,
    params.dictTypeId
      ? eq(sys_dictItemTable.dict_type_id, params.dictTypeId)
      : undefined,
    ne(sys_dictItemTable.del_flag, "2"),
  ].filter(Boolean);
  const result = await db.$count(
    sys_dictItemTable,
    conditions.length > 0 ? and(...conditions) : undefined,
  );
  return Math.ceil(result / Number(params.pageSize));
}

export async function insertDictItem(dictItem: SysDictItem) {
  const newDictItem = await db
    .insert(sys_dictItemTable)
    .values({
      dict_type_id: dictItem.dictTypeId ?? 0,
      dict_name: dictItem.dictName ?? "",
      dict_value: dictItem.dictValue ?? "",
      dict_label: dictItem.dictLabel ?? "",
      sorting: dictItem.sorting ?? 0,
      create_by: dictItem.createBy ?? 1,
      create_time: dictItem.createTime ?? new Date(),
      update_by: dictItem.updateBy ?? 1,
      update_time: new Date(),
    })
    .returning();
  return newDictItem;
}

export async function updateDictItem(dictItem: SysDictItem) {
  const updateData: Record<string, unknown> = {
    update_by: 1,
    update_time: new Date(),
  };
  if (dictItem.dictName !== undefined) updateData.dict_name = dictItem.dictName;
  if (dictItem.dictValue !== undefined) updateData.dict_value = dictItem.dictValue;
  if (dictItem.dictLabel !== undefined) updateData.dict_label = dictItem.dictLabel;
  if (dictItem.sorting !== undefined) updateData.sorting = dictItem.sorting;

  await db
    .update(sys_dictItemTable)
    .set(updateData)
    .where(eq(sys_dictItemTable.id, dictItem.id!));
}

export async function findDictItemsByType(dictType: string): Promise<SysDictItem[]> {
  const result = await db
    .select({
      id: sys_dictItemTable.id,
      dict_type_id: sys_dictItemTable.dict_type_id,
      dict_name: sys_dictItemTable.dict_name,
      dict_value: sys_dictItemTable.dict_value,
      dict_label: sys_dictItemTable.dict_label,
      sorting: sys_dictItemTable.sorting,
      color: sys_dictItemTable.color,
      create_by: sys_dictItemTable.create_by,
      update_by: sys_dictItemTable.update_by,
      del_flag: sys_dictItemTable.del_flag,
      create_time: sys_dictItemTable.create_time,
      update_time: sys_dictItemTable.update_time,
    })
    .from(sys_dictItemTable)
    .innerJoin(
      sys_dictTypeTable,
      eq(sys_dictItemTable.dict_type_id, sys_dictTypeTable.id),
    )
    .where(
      and(
        eq(sys_dictTypeTable.dict_type, dictType),
        ne(sys_dictItemTable.del_flag, "2"),
      ),
    )
    .orderBy(sys_dictItemTable.sorting);
  return result.map(dbMapping);
}

export async function softDeleteDictItem(id: number) {
  await db
    .update(sys_dictItemTable)
    .set({ del_flag: "2" })
    .where(eq(sys_dictItemTable.id, id));
}
