import { CreateForm } from "../_components/create_form";
import { fetchAllRoles } from "../_lib/actions";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";

export default async function Page() {
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
