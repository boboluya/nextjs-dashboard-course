import { fetchDictItemById, fetchDictTypes } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/permission";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ dictTypeId?: string }>;
}) {
  await hasPermission("system:sys_dict_item:edit");

  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const id = Number(params.id);
  const dictTypeId = searchParams.dictTypeId
    ? Number(searchParams.dictTypeId)
    : undefined;
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
            href: dictTypeId
              ? `/dashboard/sys_dict_item?dictTypeId=${dictTypeId}`
              : "/dashboard/sys_dict_item",
          },
          {
            label: "Edit Dict Item",
            href: `/dashboard/sys_dict_item/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm dictItem={dictItems[0]} dictTypes={dictTypes} dictTypeId={dictTypeId} />
    </div>
  );
}
