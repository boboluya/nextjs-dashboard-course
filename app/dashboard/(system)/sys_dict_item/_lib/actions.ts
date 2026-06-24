"use server";

import { SysDictItem, SysDictType } from "@/app/lib/definitions";
import {
  selectDictItems,
  selectDictItemTotal,
  insertDictItem,
  updateDictItem,
  softDeleteDictItem,
  findDictItemById,
} from "./repository";
import { selectDictTypes } from "../../sys_dict_type/_lib/repository";
import z from "zod";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApiPermission } from "@/lib/permission";

const FormSchema = z.object({
  id: z.number(),
  dictTypeId: z.coerce.number().min(1, { message: "Dict type is required." }),
  dictName: z.string().min(1, { message: "Dict name is required." })
    .max(50, { message: "Must be 50 characters or less." }),
  dictValue: z.string().min(1, { message: "Dict value is required." })
    .max(50, { message: "Must be 50 characters or less." }),
  dictLabel: z.string().min(1, { message: "Dict label is required." })
    .max(50, { message: "Must be 50 characters or less." }),
  sorting: z.coerce.number().min(0, { message: "Sorting must be >= 0." }),
});

export type State = {
  errors?: {
    dictTypeId?: string[];
    dictName?: string[];
    dictValue?: string[];
    dictLabel?: string[];
    sorting?: string[];
  };
  message?: string | null;
};

export type EditState = {
  errors?: {
    dictTypeId?: string[];
    dictName?: string[];
    dictValue?: string[];
    dictLabel?: string[];
    sorting?: string[];
  };
  message?: string | null;
};

const CreateForm = FormSchema.omit({ id: true });
const EditForm = FormSchema.omit({ id: true });

export async function searchPages(params: SysDictItem): Promise<SysDictItem[]> {
  return await selectDictItems(params);
}

export async function searchTotal(params: SysDictItem): Promise<number> {
  return await selectDictItemTotal(params);
}

export async function createSysDictItem(prevState: State, formData: FormData) {
  await hasApiPermission("system:sys_dict_item:add");

  const parsedData = CreateForm.safeParse({
    dictTypeId: formData.get("dictTypeId"),
    dictName: formData.get("dictName"),
    dictValue: formData.get("dictValue"),
    dictLabel: formData.get("dictLabel"),
    sorting: formData.get("sorting"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create.",
    };
  }
  try {
    const dictItem: SysDictItem = {
      dictTypeId: parsedData.data.dictTypeId,
      dictName: parsedData.data.dictName,
      dictValue: parsedData.data.dictValue,
      dictLabel: parsedData.data.dictLabel,
      sorting: parsedData.data.sorting,
      createTime: new Date(),
    };
    await insertDictItem(dictItem);
  } catch (e) {
    console.log(e);
    throw error("Create failed.");
  }
  revalidatePath("/dashboard/sys_dict_item");
  const dictTypeId = parsedData.data.dictTypeId;
  if (dictTypeId) {
    redirect(`/dashboard/sys_dict_item?dictTypeId=${dictTypeId}`);
  } else {
    redirect("/dashboard/sys_dict_item");
  }
}

export async function fetchDictItemById(id: number): Promise<SysDictItem[]> {
  return await findDictItemById(id);
}

export async function fetchDictTypes(): Promise<SysDictType[]> {
  return await selectDictTypes({ pageSize: 1000, pageNum: 1 } as any);
}

export async function updateSysDictItem(
  id: number,
  prevState: EditState,
  formData: FormData,
): Promise<EditState> {
  await hasApiPermission("system:sys_dict_item:edit");

  const parsedData = EditForm.safeParse({
    dictTypeId: formData.get("dictTypeId"),
    dictName: formData.get("dictName"),
    dictValue: formData.get("dictValue"),
    dictLabel: formData.get("dictLabel"),
    sorting: formData.get("sorting"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update.",
    };
  }
  try {
    const dictItem: SysDictItem = {
      id: id,
      dictTypeId: parsedData.data.dictTypeId,
      dictName: parsedData.data.dictName,
      dictValue: parsedData.data.dictValue,
      dictLabel: parsedData.data.dictLabel,
      sorting: parsedData.data.sorting,
    };
    await updateDictItem(dictItem);
  } catch (e) {
    console.log(e);
    throw error("Update failed.");
  }
  revalidatePath("/dashboard/sys_dict_item");
  const dictTypeId = parsedData.data.dictTypeId;
  if (dictTypeId) {
    redirect(`/dashboard/sys_dict_item?dictTypeId=${dictTypeId}`);
  } else {
    redirect("/dashboard/sys_dict_item");
  }
}

export async function deleteDictItem(id: number) {
  await hasApiPermission("system:sys_dict_item:delete");

  try {
    await softDeleteDictItem(id);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/dashboard/sys_dict_item");
}
