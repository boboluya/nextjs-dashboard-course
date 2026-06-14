import { fetchRoleById, fetchAllMenusForTree, fetchMenuIdsByRoleId } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { buildTree } from "@/app/lib/tree";

/**
 * Edit role page
 * Loads role data by ID and passes it to the edit form component
 */
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);

  // Load role data, menu tree, and selected menu IDs in parallel
  const [roles, menus, selectedMenuIds] = await Promise.all([
    fetchRoleById(id),
    fetchAllMenusForTree(),
    fetchMenuIdsByRoleId(id),
  ]);

  // Show 404 if role does not exist
  if (!roles || roles.length === 0) {
    notFound();
  }

  const treeData = buildTree(menus);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/dashboard/sys_role" },
          { label: "Edit Role", href: `/sys_role/${id}/edit`, active: true },
        ]}
      />
      <EditForm role={roles[0]} treeData={treeData} selectedMenuIds={selectedMenuIds} />
    </div>
  );
}
