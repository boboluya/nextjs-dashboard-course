import { fetchMenuById, fetchAllMenus } from "../../_lib/actions";
import { EditForm } from "../../_components/edit_form";
import { buildTree } from "@/app/lib/tree";
import Breadcrumbs from "@/components/custome_ui/breadcrumbs";
import { notFound } from "next/navigation";
import { hasPermission } from "@/lib/permission";

/** Collect the given node and all its descendant IDs from a flat list. */
function collectDescendantIds(
  menus: { id: number; parentId: number | null }[],
  rootId: number,
): number[] {
  const ids = [rootId];
  const childrenMap = new Map<number, number[]>();
  for (const m of menus) {
    const pid = m.parentId ?? 0;
    if (!childrenMap.has(pid)) childrenMap.set(pid, []);
    childrenMap.get(pid)!.push(m.id);
  }
  const queue = [rootId];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const kids = childrenMap.get(cur) ?? [];
    for (const kid of kids) {
      ids.push(kid);
      queue.push(kid);
    }
  }
  return ids;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  await hasPermission("system:sys_menu:edit");

  const params = await props.params;
  const id = Number(params.id);
  const menus = await fetchMenuById(id);

  if (!menus || menus.length === 0) {
    notFound();
  }

  const allMenus = await fetchAllMenus();
  const excludeIds = collectDescendantIds(
    allMenus.map((m) => ({ id: m.id!, parentId: m.parentId ?? null })),
    id,
  );
  const treeData = buildTree(
    allMenus.map((m) => ({ id: m.id!, parentId: m.parentId, label: m.name! })),
  );

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Menus", href: "/dashboard/sys_menu" },
          { label: "Edit Menu", href: `/dashboard/sys_menu/${id}/edit`, active: true },
        ]}
      />
      <EditForm menu={menus[0]} treeData={treeData} excludeIds={excludeIds} />
    </div>
  );
}
