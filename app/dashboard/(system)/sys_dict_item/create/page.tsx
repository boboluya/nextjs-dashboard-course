import { CreateForm } from "../_components/create_form";
import { fetchDictTypes } from "../_lib/actions";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";

export default async function Page(props: {
  searchParams: Promise<{ dictTypeId?: string }>;
}) {
  await hasPermission("system:sys_dict_item:add");
  const searchParams = await props.searchParams;
  const dictTypeId = searchParams.dictTypeId
    ? Number(searchParams.dictTypeId)
    : undefined;
  const dictTypes = await fetchDictTypes();
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Dict Items",
            href: dictTypeId
              ? `/dashboard/sys_dict_item?dictTypeId=${dictTypeId}`
              : "/dashboard/sys_dict_item",
          },
          {
            label: "Create Dict Item",
            href: "/dashboard/sys_dict_item/create",
            active: true,
          },
        ]}
      />
      <CreateForm dictTypes={dictTypes} defaultDictTypeId={dictTypeId} />
    </div>
  );
}
