import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { selectUserById } from "@/app/dashboard/my_user/_lib/actions";
import EditForm from "@/app/dashboard/my_user/_component/edit-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const user = await selectUserById(id);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "My User", href: "/dashboard/my_user" },
          { label: "Edit", href: `/dashboard/my_user/${id}/edit` },
        ]}
      />
      <EditForm user={user} />
    </div>
  );
}
