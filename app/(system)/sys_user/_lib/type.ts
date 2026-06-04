import { SysUser } from "@/app/lib/definitions";
export interface PageParams extends SysUser {
  pageSize?: string;
  pageNum?: string;
  sort?: string;
  category?: string;
}
