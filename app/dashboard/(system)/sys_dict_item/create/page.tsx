import { CreateForm } from "../_components/create_form";
import { fetchDictTypes } from "../_lib/actions";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";

export default async function Page() {
  await hasPermission("system:sys_dict_item:add");
  const dictTypes = await fetchDictTypes();
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Dict Items",
            href: "/dashboard/sys_dict_item",
          },
          {
            label: "Create Dict Item",
            href: "/dashboard/sys_dict_item/create",
            active: true,
          },
        ]}
      />
      <CreateForm dictTypes={dictTypes} />
    </div>
  );
}
