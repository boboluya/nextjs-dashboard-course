import { fetchDictItemById, fetchDictTypes } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/permission";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  await hasPermission("system:sys_dict_item:edit");

  const params = await props.params;
  const id = Number(params.id);
  const [dictItems, dictTypes] = await Promise.all([
    fetchDictItemById(id),
    fetchDictTypes(),
  ]);

  if (!dictItems || dictItems.length === 0) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Dict Items",
            href: "/dashboard/sys_dict_item",
          },
          {
            label: "Edit Dict Item",
            href: `/dashboard/sys_dict_item/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm dictItem={dictItems[0]} dictTypes={dictTypes} />
    </div>
  );
}
