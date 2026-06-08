import { CreateForm } from "../_components/create_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";

export default async function Page() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Menus", href: "/sys_menu" },
          { label: "Create Menu", href: "/sys_menu/create", active: true },
        ]}
      />
      <CreateForm />
    </div>
  );
}
