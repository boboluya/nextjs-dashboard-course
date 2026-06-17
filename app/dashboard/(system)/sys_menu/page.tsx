import { fetchAllMenus, fetchAllMenusTree } from "./_lib/actions";
import { TreeTable } from "./_components/tree-table";
import { CreateMenuButton } from "./_components/action-buttons";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";
import { HasPermi } from "@/components/has-permi";
import { auth } from "@/auth";

export default async function SysMenuPage() {
  await hasPermission("system:sys_menu:list");
  const session = await auth();
  const allMenus = await fetchAllMenus();
  const allMenusTree = await fetchAllMenusTree();

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="m-2">
          <Breadcrumbs
            breadcrumbs={[{ label: "Menus", href: "/dashboard/sys_menu", active: true }]}
          />
        </div>
        <div className="mr-5">
          <HasPermi session={session} permission="system:sys_menu:add">
            <CreateMenuButton />
          </HasPermi>
        </div>
      </div>

      {/* Tree Table */}
      <div className="mt-6">
        <TreeTable session={session} data={allMenus} />
      </div>
    </div>
  );
}
