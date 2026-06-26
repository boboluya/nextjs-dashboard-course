import {
  searchPages,
  searchTotal,
  fetchAllDeptsForTree,
} from "./_lib/actions";
import Search from "./_components/search";
import { PageParams } from "./_lib/type";
import PaginationSysDept from "./_components/pagination";
import { DataTable } from "./_components/data-table";
import { CreateDeptButton } from "./_components/action-buttons";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";
import { HasPermi } from "@/components/has-permi";
import { auth } from "@/auth";

export default async function SysDeptPage(props: {
  searchParams: Promise<PageParams>;
}) {
  await hasPermission("system:sys_dept:list");
  const session = await auth();

  const queryParams = await props.searchParams;
  queryParams.pageNum = queryParams.pageNum ? Number(queryParams.pageNum) : 1;
  queryParams.pageSize = queryParams.pageSize
    ? Number(queryParams.pageSize)
    : 10;
  const data = await searchPages({ ...queryParams });
  const totalPages = await searchTotal({ ...queryParams });

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="m-2">
          <Breadcrumbs
            breadcrumbs={[
              {
                label: "Departments",
                href: "/dashboard/sys_dept",
                active: true,
              },
            ]}
          />
        </div>
        <div className="mr-5">
          <HasPermi session={session} permission="system:sys_dept:add">
            <CreateDeptButton />
          </HasPermi>
        </div>
      </div>

      {/* Search Section */}
      <div className="">
        <Search />
      </div>

      {/* Table */}
      <div className="mt-6">
        <DataTable session={session} data={data} />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex w-full justify-center">
        <PaginationSysDept
          pageNum={queryParams.pageNum}
          pageSize={queryParams.pageSize}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
