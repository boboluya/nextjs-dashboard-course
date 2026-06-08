/**
 * Public tree utility — build a tree from flat items with id/parentId.
 * Reusable for menus, org charts, categories, etc.
 */

export interface TreeNode {
  id: number;
  label: string;
  children: TreeNode[];
}

/**
 * Build a tree from a flat list of items.
 *
 * @param items - flat array, each item must have `id`, `parentId`, `label`
 * @returns array of root TreeNode (parentId is null/undefined/0)
 *
 * @example
 * const tree = buildTree([
 *   { id: 1, parentId: null, label: "System" },
 *   { id: 2, parentId: 1, label: "User Management" },
 *   { id: 3, parentId: 1, label: "Menu Management" },
 *   { id: 4, parentId: 2, label: "User List" },
 * ]);
 * // => [{ id: 1, label: "System", children: [
 * //      { id: 2, label: "User Management", children: [{ id: 4, ... }] },
 * //      { id: 3, label: "Menu Management", children: [] },
 * //    ] }]
 */
export function buildTree(
  items: { id: number; parentId?: number | null; label: string }[],
): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // First pass: create all nodes
  for (const item of items) {
    nodeMap.set(item.id, {
      id: item.id,
      label: item.label,
      children: [],
    });
  }

  // Second pass: link children to parents
  for (const item of items) {
    const node = nodeMap.get(item.id)!;
    const pid = item.parentId ?? 0;
    if (pid && nodeMap.has(pid)) {
      nodeMap.get(pid)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Flatten a tree back to a list with depth info (useful for rendering indented lists).
 */
export function flattenTree(
  nodes: TreeNode[],
  depth = 0,
): { id: number; label: string; depth: number }[] {
  const result: { id: number; label: string; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ id: node.id, label: node.label, depth });
    if (node.children.length > 0) {
      result.push(...flattenTree(node.children, depth + 1));
    }
  }
  return result;
}
