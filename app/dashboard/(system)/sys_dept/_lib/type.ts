import { SysDept } from "@/app/lib/definitions";

export interface PageParams extends SysDept {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
  category?: string;
}
