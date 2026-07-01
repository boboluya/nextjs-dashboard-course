import { fetchAllMenus } from "./_lib/actions";
import { TreeTable } from "./_components/tree-table";
import { CreateMenuButton } from "./_components/action-buttons";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";
import { HasPermi } from "@/components/has-permi";

export default async function SysMenuPage() {
  await hasPermission("system:sys_menu:list");
  const allMenus = await fetchAllMenus();

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="m-2">
          <Breadcrumbs
            breadcrumbs={[
              { label: "Menus", href: "/dashboard/sys_menu", active: true },
            ]}
          />
        </div>
        <div className="mr-5">
          <HasPermi permission="system:sys_menu:add">
            <CreateMenuButton />
          </HasPermi>
        </div>
      </div>

      {/* Tree Table */}
      <div className="mt-6">
        <TreeTable data={allMenus} />
      </div>
    </div>
  );
}
