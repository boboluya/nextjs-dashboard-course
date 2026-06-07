import { searchPages, searchTotal } from "./_lib/actions";
import Search from "./_components/search";
import { PageParams } from "./_lib/type";
import PaginationSysUser from "./_components/pagination";
import { DataTable } from "./_components/data-table";
import { CreateUserButton } from "./_components/action-buttons";
import { UsersIcon } from "@heroicons/react/24/outline";

export default async function SysUserPage(props: {
  searchParams: Promise<PageParams>;
}) {
  const queryParams = await props.searchParams;
  queryParams.pageNum = queryParams.pageNum ? Number(queryParams.pageNum) : 1;
  queryParams.pageSize = queryParams.pageSize ? Number(queryParams.pageSize) : 10;
  const data = await searchPages({ ...queryParams });
  const totalPages = await searchTotal({ ...queryParams });

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <UsersIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">Manage system user accounts</p>
          </div>
        </div>
        <CreateUserButton />
      </div>

      {/* Search Section */}
      <div className="mt-6">
        <Search />
      </div>

      {/* Table */}
      <div className="mt-6">
        <DataTable data={data} />
      </div>

      {/* Pagination */}
      <div className="mt-6 flex w-full justify-center">
        <PaginationSysUser
          pageNum={queryParams.pageNum}
          pageSize={queryParams.pageSize}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
