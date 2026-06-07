import { fetchUserById } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id);
  const users = await fetchUserById(id);

  if (!users || users.length === 0) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Users", href: "/sys_user" },
          { label: "Edit User", href: `/sys_user/${id}/edit`, active: true },
        ]}
      />
      <EditForm user={users[0]} />
    </div>
  );
}
