import { columns, Payment } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { searchPages, searchTotal } from "./_lib/actions";
import { SysUser } from "@/app/lib/definitions";
import Search from "./_components/search";
import { PageParams } from "./_lib/type";
import PaginationSysUser from "./_components/pagination";

export default async function DemoPage(props: {
  searchParams: Promise<PageParams>;
}) {
  const queryParams = await props.searchParams;
  const data = await searchPages({ ...queryParams });
  const totalPages = await searchTotal({ ...queryParams });
  const pageNum = queryParams.pageNum ? Number(queryParams.pageNum) : 1;
  const pageSize = queryParams.pageSize ? Number(queryParams.pageSize) : 10;

  return (
    <div className="p-1">
      <div className="flex">
        <Search />
      </div>
      <div className="">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="m-3">
        <PaginationSysUser pageNum={pageNum} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
