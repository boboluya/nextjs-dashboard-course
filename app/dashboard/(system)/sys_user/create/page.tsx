import { CreateForm } from "../_components/create_form";
import { fetchAllRoles } from "../_lib/actions";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";

export default async function Page() {
  await hasPermission("system:sys_user:add");
  const roles = await fetchAllRoles();
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Users", href: "/dashboard/sys_user" },
          { label: "Create User", href: "/dashboard/sys_user/create", active: true },
        ]}
      />
      <CreateForm roles={roles} />
    </div>
  );
}
