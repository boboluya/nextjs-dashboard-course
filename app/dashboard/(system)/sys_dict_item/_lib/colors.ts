import type { ComponentProps } from "react";
import { Tag } from "@/components/custome_ui/tag";

type TagColor = NonNullable<ComponentProps<typeof Tag>["color"]>;

export const dictItemColors = [
  "gray",
  "blue",
  "green",
  "red",
  "yellow",
  "pink",
  "purple",
  "orange",
  "indigo",
  "teal",
] as const satisfies readonly TagColor[];

export type DictItemColor = (typeof dictItemColors)[number];
