import { searchPages, searchTotal, fetchRoleNamesByUserIds } from "./_lib/actions";
import Search from "./_components/search";
import { PageParams } from "./_lib/type";
import PaginationSysUser from "./_components/pagination";
import { DataTable } from "./_components/data-table";
import { CreateUserButton } from "./_components/action-buttons";
import { UsersIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";
import { HasPermi } from "@/components/has-permi";
import { auth } from "@/auth";

export default async function SysUserPage(props: {
  searchParams: Promise<PageParams>;
}) {
  await hasPermission("system:sys_user:list");
  const session = await auth();

  const queryParams = await props.searchParams;
  queryParams.pageNum = queryParams.pageNum ? Number(queryParams.pageNum) : 1;
  queryParams.pageSize = queryParams.pageSize
    ? Number(queryParams.pageSize)
    : 10;
  const data = await searchPages({ ...queryParams });
  const totalPages = await searchTotal({ ...queryParams });

  // Fetch role names for all users in this page
  const userIds = data.map((u) => u.userId).filter((id): id is number => id !== undefined);
  const roleNamesMap = await fetchRoleNamesByUserIds(userIds);
  const enrichedData = data.map((u) => ({
    ...u,
    roleNames: u.userId ? roleNamesMap[u.userId] || [] : [],
  }));

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="m-2">
          <Breadcrumbs
            breadcrumbs={[{ label: "Users", href: "/dashboard/sys_user", active: true }]}
          />
        </div>
        <div className="mr-5">
          <HasPermi session={session} permission="system:sys_user:add">
            <CreateUserButton />
          </HasPermi>
        </div>
      </div>

      {/* Search Section */}
      <div className="">
        <Search />
      </div>

      {/* Table */}
      <div className="mt-6">
        <DataTable session={session} data={enrichedData} />
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
