import { CreateForm } from "../_components/create_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { fetchAllMenusForTree } from "../_lib/actions";
import { buildTree } from "@/app/lib/tree";

/**
 * Create role page
 * Server component that renders breadcrumbs and create form
 */
export default async function Page() {
  // Fetch all menus and build tree structure
  const menus = await fetchAllMenusForTree();
  const treeData = buildTree(menus);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/dashboard/sys_role" },
          { label: "Create Role", href: "/dashboard/sys_role/create", active: true },
        ]}
      />
      <CreateForm treeData={treeData} />
    </div>
  );
}
