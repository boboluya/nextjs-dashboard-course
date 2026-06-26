"use server";

import { SysDept } from "@/app/lib/definitions";
import {
  selectDepts,
  selectTotal,
  insertDept,
  updateDept,
  softDeleteDept,
  findDeptById,
  selectAllDepts,
} from "./repository";
import z from "zod";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApiPermission } from "@/lib/permission";

const FormSchema = z.object({
  id: z.number(),
  parentId: z.coerce.number().min(0),
  ancestors: z.string(),
  deptName: z
    .string()
    .min(1, { message: "Department name is required." })
    .max(50, { message: "Must be shorter than 50 characters" }),
  orderNum: z.coerce.number().min(0),
  leader: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email({ message: "Invalid email format." }).nullable().or(z.literal("")),
  status: z.string(),
});

export type State = {
  errors?: {
    parentId?: string[];
    deptName?: string[];
    orderNum?: string[];
    leader?: string[];
    phone?: string[];
    email?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type EditState = {
  errors?: {
    id?: string[];
    parentId?: string[];
    deptName?: string[];
    orderNum?: string[];
    leader?: string[];
    phone?: string[];
    email?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateForm = FormSchema.omit({ id: true, ancestors: true });
const EditForm = FormSchema.omit({ ancestors: true });

export async function searchPages(sysDept: SysDept): Promise<SysDept[]> {
  return await selectDepts(sysDept);
}

export async function searchTotal(sysDept: SysDept): Promise<number> {
  return await selectTotal(sysDept);
}

/**
 * Build ancestors string by looking up parent chain
 */
async function buildAncestors(parentId: number): Promise<string> {
  if (parentId === 0) return "0";
  const parent = await findDeptById(parentId);
  if (parent.length === 0) return "0";
  const parentAncestors = parent[0].ancestors || "0";
  return `${parentAncestors},${parentId}`;
}

export async function createSysDept(prevState: State, formData: FormData) {
  await hasApiPermission("system:sys_dept:add");

  const parsedData = CreateForm.safeParse({
    parentId: formData.get("parentId"),
    deptName: formData.get("deptName"),
    orderNum: formData.get("orderNum"),
    leader: formData.get("leader") || "",
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",
    status: formData.get("status"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create.",
    };
  }

  try {
    const ancestors = await buildAncestors(parsedData.data.parentId);
    const dept: SysDept = {
      parentId: parsedData.data.parentId,
      ancestors,
      deptName: parsedData.data.deptName,
      orderNum: parsedData.data.orderNum,
      leader: parsedData.data.leader || null,
      phone: parsedData.data.phone || null,
      email: parsedData.data.email || null,
      status: parsedData.data.status,
    };
    await insertDept(dept);
  } catch (e) {
    console.log(e);
    throw error("Create failed.");
  }
  revalidatePath("/dashboard/sys_dept");
  redirect("/dashboard/sys_dept");
}

export async function fetchDeptById(id: number): Promise<SysDept[]> {
  return await findDeptById(id);
}

export async function updateSysDept(
  id: number,
  prevState: EditState,
  formData: FormData,
): Promise<EditState> {
  await hasApiPermission("system:sys_dept:edit");

  const parsedData = EditForm.safeParse({
    id: id,
    parentId: formData.get("parentId"),
    deptName: formData.get("deptName"),
    orderNum: formData.get("orderNum"),
    leader: formData.get("leader") || "",
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",
    status: formData.get("status"),
  });
  if (!parsedData.success) {
    return {
      errors: parsedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update.",
    };
  }

  try {
    const ancestors = await buildAncestors(parsedData.data.parentId);
    const dept: SysDept = {
      id: parsedData.data.id,
      parentId: parsedData.data.parentId,
      ancestors,
      deptName: parsedData.data.deptName,
      orderNum: parsedData.data.orderNum,
      leader: parsedData.data.leader || null,
      phone: parsedData.data.phone || null,
      email: parsedData.data.email || null,
      status: parsedData.data.status,
    };
    await updateDept(dept);
  } catch (e) {
    console.log(e);
    throw error("Update failed.");
  }
  revalidatePath("/dashboard/sys_dept");
  redirect("/dashboard/sys_dept");
}

export async function deleteDept(id: number) {
  await hasApiPermission("system:sys_dept:delete");

  try {
    await softDeleteDept(id);
  } catch (e) {
    console.log(e);
    throw error("Delete failed.");
  }
  revalidatePath("/dashboard/sys_dept");
}

/**
 * Fetch all departments (used for building the dept tree)
 */
export async function fetchAllDeptsForTree(): Promise<
  { id: number; parentId: number; label: string }[]
> {
  const depts = await selectAllDepts();
  return depts.map((d) => ({
    id: d.id!,
    parentId: d.parentId ?? 0,
    label: d.deptName ?? "",
  }));
}
