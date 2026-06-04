"use server";

import { SysUser } from "@/app/lib/definitions";
import { selectUsers, selectTotal } from "./repository";

export async function searchPages(sysUser: SysUser): Promise<SysUser[]> {
  return await selectUsers(sysUser);
}

export async function searchTotal(sysUser: SysUser): Promise<number> {
  return await selectTotal(sysUser);
}
