"use server";
import { db } from "@/src/index";
import { sys_dictTypeTable } from "@/src/db/schema";
import { eq, and, like, ne } from "drizzle-orm";
import { SysDictType } from "@/app/lib/definitions";
import { PageParams } from "./type";

function dbMapping(row: typeof sys_dictTypeTable.$inferSelect): SysDictType {
  return {
    id: row.id ?? undefined,
    dictName: row.dict_name ?? undefined,
    dictType: row.dict_type ?? undefined,
    createBy: row.create_by ?? undefined,
    updateBy: row.update_by ?? undefined,
    delFlag: row.del_flag ?? null,
    createTime: row.create_time ?? undefined,
    updateTime: row.update_time ?? undefined,
  };
}

export async function findDictTypeById(id: number): Promise<SysDictType[]> {
  const result = await db
    .select()
    .from(sys_dictTypeTable)
    .where(
      and(
        eq(sys_dictTypeTable.id, id),
        eq(sys_dictTypeTable.del_flag, "0"),
      ),
    );
  return result.map(dbMapping);
}

export async function selectDictTypes(params: PageParams): Promise<SysDictType[]> {
  const conditions = [
    params.dictName
      ? like(sys_dictTypeTable.dict_name, `%${params.dictName}%`)
      : undefined,
    params.dictType
      ? like(sys_dictTypeTable.dict_type, `%${params.dictType}%`)
      : undefined,
    ne(sys_dictTypeTable.del_flag, "2"),
  ];
  const result = await db
    .select()
    .from(sys_dictTypeTable)
    .where(
      conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined,
    )
    .limit(Number(params.pageSize))
    .offset((Number(params.pageNum) - 1) * Number(params.pageSize));
  return result.map(dbMapping);
}

export async function selectDictTypeTotal(params: PageParams): Promise<number> {
  const conditions = [
    params.dictName
      ? like(sys_dictTypeTable.dict_name, `%${params.dictName}%`)
      : undefined,
    params.dictType
      ? like(sys_dictTypeTable.dict_type, `%${params.dictType}%`)
      : undefined,
    ne(sys_dictTypeTable.del_flag, "2"),
  ].filter(Boolean);
  const result = await db.$count(
    sys_dictTypeTable,
    conditions.length > 0 ? and(...conditions) : undefined,
  );
  return Math.ceil(result / Number(params.pageSize));
}

export async function insertDictType(dictType: SysDictType) {
  const newDictType = await db
    .insert(sys_dictTypeTable)
    .values({
      dict_name: dictType.dictName ?? "",
      dict_type: dictType.dictType ?? "",
      create_by: dictType.createBy ?? 1,
      create_time: dictType.createTime ?? new Date(),
      update_by: dictType.updateBy ?? 1,
      update_time: new Date(),
    })
    .returning();
  return newDictType;
}

export async function updateDictType(dictType: SysDictType) {
  const updateData: Record<string, unknown> = {
    update_by: 1,
    update_time: new Date(),
  };
  if (dictType.dictName !== undefined) updateData.dict_name = dictType.dictName;
  if (dictType.dictType !== undefined) updateData.dict_type = dictType.dictType;

  await db
    .update(sys_dictTypeTable)
    .set(updateData)
    .where(eq(sys_dictTypeTable.id, dictType.id!));
}

export async function softDeleteDictType(id: number) {
  await db
    .update(sys_dictTypeTable)
    .set({ del_flag: "2" })
    .where(eq(sys_dictTypeTable.id, id));
}
