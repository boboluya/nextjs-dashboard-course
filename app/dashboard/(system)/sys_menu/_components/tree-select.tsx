"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface TreeNode {
  id: number;
  label: string;
  children: TreeNode[];
}

interface TreeSelectProps {
  treeData: TreeNode[];
  value?: number | null;
  onValueChange?: (value: number | null) => void;
  /** Hidden input name for form submission */
  name?: string;
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** IDs to exclude from the tree (e.g. current node + descendants) */
  excludeIds?: number[];
}

export function TreeSelect({
  treeData,
  value,
  onValueChange,
  name = "parentId",
  placeholder = "Select parent (root if empty)",
  excludeIds = [],
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const findLabel = (nodes: TreeNode[], targetId: number): string | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node.label;
      if (node.children.length > 0) {
        const found = findLabel(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedLabel = value ? findLabel(treeData, value) : null;
  const excludeSet = new Set(excludeIds);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={name} value={value ?? ""} />
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-200 font-normal"
        >
          <span className={cn("truncate", !selectedLabel && "text-gray-400")}>
            {selectedLabel || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <span
                role="button"
                tabIndex={0}
                className="rounded p-0.5 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange?.(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onValueChange?.(null);
                  }
                }}
              >
                <XMarkIcon className="h-3.5 w-3.5 text-gray-400" />
              </span>
            )}
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-white"
        align="start"
      >
        <div className="max-h-60 overflow-y-auto py-1">
          {/* Root option */}
          <button
            type="button"
            className={cn(
              "flex w-full items-center px-3 py-1.5 text-sm hover:bg-gray-100",
              value === null && "bg-blue-50 text-blue-700 font-medium",
            )}
            onClick={() => {
              onValueChange?.(null);
              setOpen(false);
            }}
          >
            {placeholder}
          </button>
          {/* Tree nodes */}
          <TreeNodeList
            nodes={treeData}
            depth={0}
            value={value}
            expandedIds={expandedIds}
            excludeSet={excludeSet}
            onToggleExpand={toggleExpand}
            onSelect={(id) => {
              onValueChange?.(id);
              setOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TreeNodeList({
  nodes,
  depth,
  value,
  expandedIds,
  excludeSet,
  onToggleExpand,
  onSelect,
}: {
  nodes: TreeNode[];
  depth: number;
  value: number | null | undefined;
  expandedIds: Set<number>;
  excludeSet: Set<number>;
  onToggleExpand: (id: number) => void;
  onSelect: (id: number) => void;
}) {
  return (
    <>
      {nodes.map((node) => {
        if (excludeSet.has(node.id)) return null;
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedIds.has(node.id);
        const isSelected = value === node.id;

        return (
          <div key={node.id}>
            <div
              className={cn(
                "flex w-full items-center py-1.5 text-sm hover:bg-gray-100",
                isSelected && "bg-blue-50 text-blue-700 font-medium",
              )}
              style={{ paddingLeft: `${depth * 16 + 12}px` }}
            >
              {/* Expand/collapse toggle — only for nodes with children */}
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
              {/* Label — always clickable to select */}
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => onSelect(node.id)}
              >
                {node.label}
              </button>
            </div>
            {hasChildren && isExpanded && (
              <TreeNodeList
                nodes={node.children}
                depth={depth + 1}
                value={value}
                expandedIds={expandedIds}
                excludeSet={excludeSet}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
