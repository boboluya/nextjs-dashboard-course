import { SysDictType } from "@/app/lib/definitions";
export interface PageParams extends SysDictType {
  pageSize?: number;
  pageNum?: number;
  sort?: string;
  category?: string;
}
