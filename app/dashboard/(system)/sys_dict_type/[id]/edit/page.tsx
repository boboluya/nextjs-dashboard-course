import { fetchDictTypeById } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/permission";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  await hasPermission("system:sys_dict_type:edit");

  const params = await props.params;
  const id = Number(params.id);
  const dictTypes = await fetchDictTypeById(id);

  if (!dictTypes || dictTypes.length === 0) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Dict Types",
            href: "/dashboard/sys_dict_type",
          },
          {
            label: "Edit Dict Type",
            href: `/dashboard/sys_dict_type/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm dictType={dictTypes[0]} />
    </div>
  );
}
