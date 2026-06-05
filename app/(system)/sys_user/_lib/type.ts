import { SysUser } from "@/app/lib/definitions";
export interface PageParams extends SysUser {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
  category?: string;
}
