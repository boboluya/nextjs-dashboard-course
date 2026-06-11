import { fetchRoleById } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";

/**
 * 编辑角色页面
 * 根据 ID 加载角色数据，传递给编辑表单组件
 */
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
  const roles = await fetchRoleById(id);

  // 角色不存在时显示 404
  if (!roles || roles.length === 0) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/sys_role" },
          { label: "Edit Role", href: `/sys_role/${id}/edit`, active: true },
        ]}
      />
      <EditForm role={roles[0]} />
    </div>
  );
}
