import { columns, Payment } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { searchPages } from "./_lib/actions";
import { SysUser } from "@/app/lib/definitions";
import Search from "./_components/search";

export default async function DemoPage() {
  const query: Partial<SysUser> = {};
  const data = await searchPages({ ...query });

  return (
    <div>
      <div className="flex gap-4">
        <Search />
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
