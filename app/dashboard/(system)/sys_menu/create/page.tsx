import { CreateForm } from "../_components/create_form";
import { fetchAllMenus } from "../_lib/actions";
import { buildTree } from "@/app/lib/tree";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";

export default async function Page() {
  const menus = await fetchAllMenus();
  const treeData = buildTree(
    menus.map((m) => ({ id: m.id!, parentId: m.parentId, label: m.name! })),
  );

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Menus", href: "/dashboard/sys_menu" },
          { label: "Create Menu", href: "/dashboard/sys_menu/create", active: true },
        ]}
      />
      <CreateForm treeData={treeData} />
    </div>
  );
}
