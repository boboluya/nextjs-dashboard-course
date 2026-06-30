import { NextRequest, NextResponse } from "next/server";
import { findDictItemsByType } from "@/app/dashboard/(system)/sys_dict_item/_lib/repository";

export async function GET(request: NextRequest) {
  const dictType = request.nextUrl.searchParams.get("dictType");
  if (!dictType) {
    return NextResponse.json({ error: "dictType is required" }, { status: 400 });
  }
  const items = await findDictItemsByType(dictType);
  return NextResponse.json(items);
}
