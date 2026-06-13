import { fetchRoleById, fetchAllMenusForTree, fetchMenuIdsByRoleId } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { buildTree } from "@/app/lib/tree";

/**
 * 编辑角色页面
 * 根据 ID 加载角色数据，传递给编辑表单组件
 */
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);

  // 并行加载角色数据、菜单树、已选菜单 ID
  const [roles, menus, selectedMenuIds] = await Promise.all([
    fetchRoleById(id),
    fetchAllMenusForTree(),
    fetchMenuIdsByRoleId(id),
  ]);

  // 角色不存在时显示 404
  if (!roles || roles.length === 0) {
    notFound();
  }

  const treeData = buildTree(menus);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/sys_role" },
          { label: "Edit Role", href: `/sys_role/${id}/edit`, active: true },
        ]}
      />
      <EditForm role={roles[0]} treeData={treeData} selectedMenuIds={selectedMenuIds} />
    </div>
  );
}
