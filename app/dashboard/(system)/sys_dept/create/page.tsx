import { CreateForm } from "../_components/create_form";
import { fetchAllDeptsForTree } from "../_lib/actions";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { hasPermission } from "@/lib/permission";

function buildTree(
  depts: { id: number; parentId: number; label: string }[],
): { id: number; label: string; children: any[] }[] {
  const map = new Map<
    number,
    { id: number; label: string; children: any[] }
  >();
  const roots: { id: number; label: string; children: any[] }[] = [];

  depts.forEach((d) => {
    map.set(d.id, { id: d.id, label: d.label, children: [] });
  });

  depts.forEach((d) => {
    const node = map.get(d.id)!;
    if (d.parentId === 0 || !map.has(d.parentId)) {
      roots.push(node);
    } else {
      map.get(d.parentId)!.children.push(node);
    }
  });

  return roots;
}

export default async function Page() {
  await hasPermission("system:sys_dept:add");
  const allDepts = await fetchAllDeptsForTree();
  const treeData = buildTree(allDepts);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Departments", href: "/dashboard/sys_dept" },
          {
            label: "Create Department",
            href: "/dashboard/sys_dept/create",
            active: true,
          },
        ]}
      />
      <CreateForm treeData={treeData} />
    </div>
  );
}
