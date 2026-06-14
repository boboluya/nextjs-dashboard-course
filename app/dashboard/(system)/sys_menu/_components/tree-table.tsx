"use client";

import { useState, useMemo } from "react";
import { SysMenu } from "@/app/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditMenuButton, DeleteMenuButton } from "./action-buttons";
import { Tag, StatusTag } from "@/components/custome_ui/tag";
import {
  FolderIcon,
  DocumentIcon,
  CursorArrowRaysIcon,
  CommandLineIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// ── tree node type (self-contained, carries full SysMenu data) ──

interface TreeNode {
  id: number;
  label: string;
  children: TreeNode[];
  menu: SysMenu;
}

const typeMap: Record<
  string,
  { label: string; color: "blue" | "green" | "orange" | "gray"; icon: typeof FolderIcon }
> = {
  D: { label: "Directory", color: "blue", icon: FolderIcon },
  M: { label: "Menu", color: "green", icon: DocumentIcon },
  B: { label: "Button", color: "orange", icon: CursorArrowRaysIcon },
  F: { label: "File", color: "gray", icon: CommandLineIcon },
};

// ── helpers ──────────────────────────────────────────────

/** Build an extended tree that carries full SysMenu data on each node. */
function buildDataTree(menus: SysMenu[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  for (const m of menus) {
    nodeMap.set(m.id!, {
      id: m.id!,
      label: m.name ?? "",
      children: [],
      menu: m,
    });
  }

  for (const m of menus) {
    const node = nodeMap.get(m.id!)!;
    const pid = m.parentId ?? 0;
    if (pid && nodeMap.has(pid)) {
      nodeMap.get(pid)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort children by sorting field at each level
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.menu.sorting ?? 0) - (b.menu.sorting ?? 0));
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
}

/** Collect all node IDs in the tree (for expand-all / collapse-all). */
function collectAllIds(nodes: TreeNode[]): number[] {
  const ids: number[] = [];
  for (const n of nodes) {
    if (n.children.length > 0) {
      ids.push(n.id);
      ids.push(...collectAllIds(n.children));
    }
  }
  return ids;
}

// ── component ────────────────────────────────────────────

export function TreeTable({ data }: { data: SysMenu[] }) {
  const tree = useMemo(() => buildDataTree(data), [data]);
  const allExpandableIds = useMemo(() => collectAllIds(tree), [tree]);

  // Track which nodes are expanded (default: root level expanded)
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    return new Set(tree.map((n) => n.id));
  });

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(allExpandableIds));
  const collapseAll = () => setExpanded(new Set());

  // Flatten visible tree into rows for table rendering
  const rows = useMemo(() => {
    const result: { node: TreeNode; depth: number }[] = [];
    const walk = (nodes: TreeNode[], depth: number) => {
      for (const node of nodes) {
        result.push({ node, depth });
        if (expanded.has(node.id) && node.children.length > 0) {
          walk(node.children, depth + 1);
        }
      }
    };
    walk(tree, 0);
    return result;
  }, [tree, expanded]);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No menus</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new menu.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={expandAll}
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Collapse All
        </button>
      </div>

      {/* Desktop Tree Table */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="pl-6 font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Label
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Path
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Permission
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Sorting
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="pr-6 text-right font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ node, depth }) => {
                const { menu } = node;
                const typeInfo = typeMap[menu.type || "M"] || typeMap["M"];
                const TypeIcon = typeInfo.icon;
                const hasChildren = node.children.length > 0;
                const isExpanded = expanded.has(node.id);

                return (
                  <TableRow
                    key={node.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    {/* Name with tree indentation */}
                    <TableCell className="pl-6">
                      <div
                        className="flex items-center gap-1"
                        style={{ paddingLeft: depth * 24 }}
                      >
                        {/* Expand / collapse toggle */}
                        {hasChildren ? (
                          <button
                            onClick={() => toggle(node.id)}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-gray-100"
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        ) : (
                          <span className="w-5 shrink-0" />
                        )}

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {menu.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {menu.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {menu.label}
                    </TableCell>
                    <TableCell>
                      <Tag text={typeInfo.label} color={typeInfo.color} />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600">
                        {menu.path || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600">
                        {menu.perms || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {menu.sorting}
                    </TableCell>
                    <TableCell>
                      <StatusTag
                        text={menu.status === 0 ? "Active" : "Disabled"}
                        color={menu.status === 0 ? "green" : "red"}
                      />
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex justify-end gap-2">
                        <EditMenuButton id={menu.id!} />
                        <DeleteMenuButton id={menu.id!} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Tree Cards */}
      <div className="md:hidden">
        <div className="space-y-3">
          {rows.map(({ node, depth }) => {
            const { menu } = node;
            const typeInfo = typeMap[menu.type || "M"] || typeMap["M"];
            const TypeIcon = typeInfo.icon;
            const hasChildren = node.children.length > 0;
            const isExpanded = expanded.has(node.id);

            return (
              <div
                key={node.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                style={{ marginLeft: depth * 16 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Expand / collapse toggle */}
                    {hasChildren ? (
                      <button
                        onClick={() => toggle(node.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-gray-100"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    ) : null}

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {menu.name}
                      </p>
                      <p className="text-sm text-gray-500">{menu.label}</p>
                    </div>
                  </div>
                  <Tag text={typeInfo.label} color={typeInfo.color} />
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                  {menu.path && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Path:</span>
                      <span className="font-mono">{menu.path}</span>
                    </div>
                  )}
                  {menu.perms && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Perms:</span>
                      <span className="font-mono">{menu.perms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <StatusTag
                      text={menu.status === 0 ? "Active" : "Disabled"}
                      color={menu.status === 0 ? "green" : "red"}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                  <EditMenuButton id={menu.id!} />
                  <DeleteMenuButton id={menu.id!} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
