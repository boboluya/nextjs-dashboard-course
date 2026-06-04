"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const searchCols = [
  {
    prop: "userId",
    type: "number",
    label: "User Id",
  },
  {
    prop: "userName",
    type: "string",
    label: "User Name",
  },
  {
    prop: "nickName",
    type: "string",
    label: "Nick Name",
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
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="grid grid-cols-4 items-center gap-6 p-4  w-full items-center">
      {searchCols.map((param) => {
        return (
          <div key={param.prop} className="flex items-center gap-2">
            <label
              htmlFor={param.prop}
              className="whitespace-nowrap text-sm font-medium text-gray-700 "
            >
              {param.label}
            </label>
            <Input
              className="border-gray-500 border-2"
              id={param.prop}
              placeholder={`enter ${param.label}`}
              type={param.type}
              step={param?.type == "number" ? 1 : undefined}
              value={query[param.prop] || ""}
              onChange={(e) => {
                setQuery({
                  ...query,
                  [param.prop]: e.target.value,
                });
              }}
            />
          </div>
        );
      })}
      <Button onClick={handleSearch} className="bg-black text-white ml-auto w-1/2">
        Search
      </Button>
    </div>
  );
}
