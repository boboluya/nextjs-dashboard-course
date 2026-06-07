import { fetchUserById } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
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
      <EditForm user={users[0]} />
    </div>
  );
}
