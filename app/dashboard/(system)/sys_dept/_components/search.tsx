"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const searchCols = [
  {
    prop: "deptName",
    type: "string",
    label: "Department Name",
  },
  {
    prop: "leader",
    type: "string",
    label: "Leader",
  },
];

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [query, setQuery] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    searchCols.map((col) => {
      initial[col.prop] = searchParams.get(col.prop) || "";
    });
    return initial;
  });

  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    Object.entries(query).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.set("pageNum", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleReset = () => {
    const reset: Record<string, string> = {};
    searchCols.forEach((col) => {
      reset[col.prop] = "";
    });
    setQuery(reset);
    replace(pathname);
  };

  const hasFilters = Object.values(query).some((v) => v !== "");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {searchCols.map((param) => (
          <div key={param.prop} className="flex flex-col gap-1.5">
            <label
              htmlFor={param.prop}
              className="text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {param.label}
            </label>
            <Input
              id={param.prop}
              placeholder={`Search by ${param.label.toLowerCase()}`}
              type={param.type}
              value={query[param.prop] || ""}
              onChange={(e) => {
                setQuery({ ...query, [param.prop]: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="border-gray-200 bg-gray-50 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>
        ))}
        <div className="flex items-end gap-2">
          <Button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-500"
          >
            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
          {hasFilters && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
