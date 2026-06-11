import { CreateForm } from "../_components/create_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";

/**
 * 创建角色页面
 * 服务端组件，渲染面包屑和创建表单
 */
export default function Page() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/sys_role" },
          { label: "Create Role", href: "/sys_role/create", active: true },
        ]}
      />
      <CreateForm />
    </div>
  );
}
