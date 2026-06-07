import { CreateForm } from "../_components/create_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";

export default async function Page() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Users", href: "/sys_user" },
          { label: "Create User", href: "/sys_user/create", active: true },
        ]}
      />
      <CreateForm />
    </div>
  );
}
