"use client";

import useSWR from "swr";
import { Tag } from "@/components/custome_ui/tag";
import type { ComponentProps } from "react";
import type { SysDictItem } from "@/app/lib/definitions";

type TagProps = ComponentProps<typeof Tag>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DictTag({
  dictType,
  dictValue,
  color: fallbackColor,
}: {
  dictType: string;
  dictValue: string;
  color?: TagProps["color"];
}) {
  const { data: items } = useSWR<SysDictItem[]>(
    `/api/dict-items?dictType=${dictType}`,
    fetcher,
  );
  if (!dictValue) return <Tag text="" color={fallbackColor} />;

  const matched = items?.find((item) => item.dictValue === dictValue);
  const label = matched?.dictLabel || dictValue;
  const color = (matched?.color as TagProps["color"]) ?? fallbackColor;

  return <Tag text={label} color={color} />;
}
