import { SysRole } from "@/app/lib/definitions";
export interface PageParams extends SysRole {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
}
