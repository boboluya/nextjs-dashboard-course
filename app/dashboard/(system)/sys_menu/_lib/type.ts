import { SysMenu } from "@/app/lib/definitions";
export interface PageParams extends SysMenu {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
  category?: string;
}
