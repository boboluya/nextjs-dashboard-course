import { fetchUserById, fetchAllRoles, fetchRolesByUserId } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/permission";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  await hasPermission("system:sys_user:edit");

  const params = await props.params;
  const id = Number(params.id);
  const [users, roles, selectedRoleIds] = await Promise.all([
    fetchUserById(id),
    fetchAllRoles(),
    fetchRolesByUserId(id),
  ]);

  if (!users || users.length === 0) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Users", href: "/dashboard/sys_user" },
          { label: "Edit User", href: `/sys_user/${id}/edit`, active: true },
        ]}
      />
      <EditForm user={users[0]} roles={roles} selectedRoleIds={selectedRoleIds} />
    </div>
  );
}
