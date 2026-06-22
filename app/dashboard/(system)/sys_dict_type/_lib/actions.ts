"use server";

import { SysDictType } from "@/app/lib/definitions";
import {
  selectDictTypes,
  selectDictTypeTotal,
  insertDictType,
  updateDictType,
  softDeleteDictType,
  findDictTypeById,
} from "./repository";
import z from "zod";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApiPermission } from "@/lib/permission";

const FormSchema = z.object({
  id: z.number(),
  dictName: z.string().min(1, { message: "Dict name is required." })
    .max(50, { message: "Must be 50 characters or less." }),
  dictType: z.string().min(1, { message: "Dict type is required." })
    .max(50, { message: "Must be 50 characters or less." }),
});

export type State = {
  errors?: {
    dictName?: string[];
    dictType?: string[];
  };
  message?: string | null;
};

export type EditState = {
  errors?: {
    dictName?: string[];
    dictType?: string[];
  };
  message?: string | null;
};

const CreateForm = FormSchema.omit({ id: true });
const EditForm = FormSchema.omit({ id: true });

export async function searchPages(params: SysDictType): Promise<SysDictType[]> {
  return await selectDictTypes(params);
}

export async function searchTotal(params: SysDictType): Promise<number> {
  return await selectDictTypeTotal(params);
}

export async function createSysDictType(prevState: State, formData: FormData) {
  await hasApiPermission("system:sys_dict_type:add");

  const parsedData = CreateForm.safeParse({
    dictName: formData.get("dictName"),
    dictType: formData.get("dictType"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create.",
    };
  }
  try {
    const dictType: SysDictType = {
      dictName: parsedData.data.dictName,
      dictType: parsedData.data.dictType,
      createTime: new Date(),
    };
    await insertDictType(dictType);
  } catch (e) {
    console.log(e);
    throw error("Create failed.");
  }
  revalidatePath("/dashboard/sys_dict_type");
  redirect("/dashboard/sys_dict_type");
}

export async function fetchDictTypeById(id: number): Promise<SysDictType[]> {
  return await findDictTypeById(id);
}

export async function updateSysDictType(
  id: number,
  prevState: EditState,
  formData: FormData,
): Promise<EditState> {
  await hasApiPermission("system:sys_dict_type:edit");

  const parsedData = EditForm.safeParse({
    dictName: formData.get("dictName"),
    dictType: formData.get("dictType"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update.",
    };
  }
  try {
    const dictType: SysDictType = {
      id: id,
      dictName: parsedData.data.dictName,
      dictType: parsedData.data.dictType,
    };
    await updateDictType(dictType);
  } catch (e) {
    console.log(e);
    throw error("Update failed.");
  }
  revalidatePath("/dashboard/sys_dict_type");
  redirect("/dashboard/sys_dict_type");
}

export async function deleteDictType(id: number) {
  await hasApiPermission("system:sys_dict_type:delete");

  try {
    await softDeleteDictType(id);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/dashboard/sys_dict_type");
}
