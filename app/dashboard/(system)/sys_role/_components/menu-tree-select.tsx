"use client";

/**
 * 菜单树形多选组件
 * 支持勾选父节点时自动勾选所有子节点，反之亦然
 */
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface TreeNode {
  id: number;
  label: string;
  children: TreeNode[];
}

interface MenuTreeSelectProps {
  treeData: TreeNode[];
  selectedMenuIds: number[];
  onChange: (menuIds: number[]) => void;
  name?: string;
  placeholder?: string;
  error?: string[];
}

/**
 * 收集节点及其所有子节点的 ID
 */
function collectDescendantIds(node: TreeNode): number[] {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...collectDescendantIds(child));
  }
  return ids;
}

/**
 * 构建 id -> node 的映射
 */
function buildNodeMap(nodes: TreeNode[], map: Map<number, TreeNode> = new Map()): Map<number, TreeNode> {
  for (const node of nodes) {
    map.set(node.id, node);
    if (node.children.length > 0) {
      buildNodeMap(node.children, map);
    }
  }
  return map;
}

/**
 * 获取节点的所有祖先 ID
 */
function getAncestorIds(nodeId: number, nodeMap: Map<number, TreeNode>, nodes: TreeNode[]): number[] {
  // 构建 childId -> parentId 映射
  const parentMap = new Map<number, number>();
  const buildParentMap = (treeNodes: TreeNode[], parentId?: number) => {
    for (const node of treeNodes) {
      if (parentId !== undefined) {
        parentMap.set(node.id, parentId);
      }
      if (node.children.length > 0) {
        buildParentMap(node.children, node.id);
      }
    }
  };
  buildParentMap(nodes);

  const ancestors: number[] = [];
  let currentId: number | undefined = parentMap.get(nodeId);
  while (currentId !== undefined) {
    ancestors.push(currentId);
    currentId = parentMap.get(currentId);
  }
  return ancestors;
}

export function MenuTreeSelect({
  treeData,
  selectedMenuIds,
  onChange,
  name = "menuIds",
  placeholder = "Select menus...",
  error,
}: MenuTreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const nodeMap = useMemo(() => buildNodeMap(treeData), [treeData]);
  const selectedSet = useMemo(() => new Set(selectedMenuIds), [selectedMenuIds]);

  // 计算每个节点的显示状态（全选/半选/未选）
  const nodeCheckState = useMemo(() => {
    const state = new Map<number, "checked" | "indeterminate" | "unchecked">();

    const computeState = (node: TreeNode): "checked" | "indeterminate" | "unchecked" => {
      if (node.children.length === 0) {
        return selectedSet.has(node.id) ? "checked" : "unchecked";
      }

      const childStates = node.children.map(computeState);
      const allChecked = childStates.every((s) => s === "checked");
      const someChecked = childStates.some((s) => s === "checked" || s === "indeterminate");

      if (allChecked) return "checked";
      if (someChecked) return "indeterminate";
      return "unchecked";
    };

    for (const node of treeData) {
      const computeForTree = (n: TreeNode) => {
        state.set(n.id, computeState(n));
        n.children.forEach(computeForTree);
      };
      computeForTree(node);
    }

    return state;
  }, [treeData, selectedSet]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleNode = (node: TreeNode) => {
    const descendantIds = collectDescendantIds(node);
    const isCurrentlyChecked = nodeCheckState.get(node.id) === "checked";

    let newSelected: number[];
    if (isCurrentlyChecked) {
      // 取消选中：移除该节点及所有子节点
      const removeSet = new Set(descendantIds);
      newSelected = selectedMenuIds.filter((id) => !removeSet.has(id));
    } else {
      // 选中：添加该节点及所有子节点
      const addSet = new Set(descendantIds);
      newSelected = [...new Set([...selectedMenuIds, ...addSet])];
    }

    onChange(newSelected);
  };

  const selectedCount = selectedMenuIds.length;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-gray-200 font-normal"
          >
            <span className={cn("truncate", selectedCount === 0 && "text-gray-400")}>
              {selectedCount > 0 ? `${selectedCount} menu(s) selected` : placeholder}
            </span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 bg-white"
          align="start"
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {treeData.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">No menus available</p>
            ) : (
              <TreeNodeList
                nodes={treeData}
                depth={0}
                expandedIds={expandedIds}
                nodeCheckState={nodeCheckState}
                onToggleExpand={toggleExpand}
                onToggleNode={toggleNode}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
      {/* Hidden inputs for form submission */}
      {selectedMenuIds.map((menuId) => (
        <input key={menuId} type="hidden" name={name} value={menuId} />
      ))}
      {error &&
        error.map((e) => (
          <p className="text-sm text-red-500 flex items-center gap-1" key={e}>
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
            {e}
          </p>
        ))}
    </div>
  );
}

function TreeNodeList({
  nodes,
  depth,
  expandedIds,
  nodeCheckState,
  onToggleExpand,
  onToggleNode,
}: {
  nodes: TreeNode[];
  depth: number;
  expandedIds: Set<number>;
  nodeCheckState: Map<number, "checked" | "indeterminate" | "unchecked">;
  onToggleExpand: (id: number) => void;
  onToggleNode: (node: TreeNode) => void;
}) {
  return (
    <>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedIds.has(node.id);
        const checkState = nodeCheckState.get(node.id) ?? "unchecked";

        return (
          <div key={node.id}>
            <div
              className="flex w-full items-center py-1.5 text-sm hover:bg-gray-100"
              style={{ paddingLeft: `${depth * 16 + 12}px` }}
            >
              {/* Expand/collapse toggle */}
              {hasChildren ? (
                <button
                  type="button"
                  className="mr-1 shrink-0 rounded p-0.5 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(node.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-3.5 w-3.5 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="h-3.5 w-3.5 text-gray-500" />
                  )}
                </button>
              ) : (
                <span className="mr-1 w-5" />
              )}

              {/* Checkbox */}
              <button
                type="button"
                className={cn(
                  "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                  checkState === "checked" || checkState === "indeterminate"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleNode(node);
                }}
              >
                {checkState === "checked" && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {checkState === "indeterminate" && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                )}
              </button>

              {/* Label */}
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleNode(node);
                }}
              >
                {node.label}
              </button>
            </div>
            {hasChildren && isExpanded && (
              <TreeNodeList
                nodes={node.children}
                depth={depth + 1}
                expandedIds={expandedIds}
                nodeCheckState={nodeCheckState}
                onToggleExpand={onToggleExpand}
                onToggleNode={onToggleNode}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
