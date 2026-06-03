"use server";

import { SysUser } from "@/app/lib/definitions";
import { selectUsers } from "./repository";

export async function searchPages(sysUser: SysUser): Promise<SysUser[]> {
  return await selectUsers(sysUser);
}
