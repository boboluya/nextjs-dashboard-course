import { fetchDeptById, fetchAllDeptsForTree } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
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

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  await hasPermission("system:sys_dept:edit");

  const params = await props.params;
  const id = Number(params.id);
  const [depts, allDepts] = await Promise.all([
    fetchDeptById(id),
    fetchAllDeptsForTree(),
  ]);

  if (!depts || depts.length === 0) {
    notFound();
  }

  const treeData = buildTree(allDepts);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Departments", href: "/dashboard/sys_dept" },
          {
            label: "Edit Department",
            href: `/sys_dept/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm dept={depts[0]} treeData={treeData} />
    </div>
  );
}
