import { SysDictItem } from "@/app/lib/definitions";
export interface PageParams extends SysDictItem {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
  category?: string;
}
