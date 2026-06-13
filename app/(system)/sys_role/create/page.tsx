import { CreateForm } from "../_components/create_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { fetchAllMenusForTree } from "../_lib/actions";
import { buildTree } from "@/app/lib/tree";

/**
 * 创建角色页面
 * 服务端组件，渲染面包屑和创建表单
 */
export default async function Page() {
  // 获取所有菜单并构建树形结构
  const menus = await fetchAllMenusForTree();
  const treeData = buildTree(menus);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/sys_role" },
          { label: "Create Role", href: "/sys_role/create", active: true },
        ]}
      />
      <CreateForm treeData={treeData} />
    </div>
  );
}
