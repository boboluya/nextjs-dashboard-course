import { fetchMenuById } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
  const menus = await fetchMenuById(id);

  if (!menus || menus.length === 0) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Menus", href: "/sys_menu" },
          { label: "Edit Menu", href: `/sys_menu/${id}/edit`, active: true },
        ]}
      />
      <EditForm menu={menus[0]} />
    </div>
  );
}
