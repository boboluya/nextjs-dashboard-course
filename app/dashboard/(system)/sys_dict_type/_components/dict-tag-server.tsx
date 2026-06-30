import { fetchDictItemsByType } from "../_lib/actions";
import { Tag } from "@/components/custome_ui/tag";
import type { ComponentProps } from "react";

type TagProps = ComponentProps<typeof Tag>;

export async function DictTagServer({
  dictType,
  dictValue,
  color,
}: {
  dictType: string;
  dictValue: string;
  color?: TagProps["color"];
}) {
  if (!dictValue) return <Tag text="" color={color} />;

  const items = await fetchDictItemsByType(dictType);
  const matched = items.find((item) => item.dictValue === dictValue);
  const label = matched?.dictLabel || dictValue;

  return <Tag text={label} color={color} />;
}
