import { CreateForm } from "../_components/create_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";

export default async function Page() {
  await hasPermission("system:sys_dict_type:add");
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Dict Types",
            href: "/dashboard/sys_dict_type",
          },
          {
            label: "Create Dict Type",
            href: "/dashboard/sys_dict_type/create",
            active: true,
          },
        ]}
      />
      <CreateForm />
    </div>
  );
}
