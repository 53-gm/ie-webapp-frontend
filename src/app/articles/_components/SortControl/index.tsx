"use client";

import { Box, Option, Select } from "@yamada-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SortControlProps {
  defaultSortBy?: string;
}

export default function SortControl({
  defaultSortBy = "newest",
}: SortControlProps) {
  // 状態の初期値は適当な値にし、マウント後に正しい値を設定
  const [sortValue, setSortValue] = useState("newest");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // マウント後にdefaultSortByを設定
  useEffect(() => {
    setSortValue(defaultSortBy);
  }, [defaultSortBy]);

  const handleSortChange = (value: string) => {
    setSortValue(value);

    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString());

    // ソート順を設定
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // パラメータを付けてナビゲーション
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box>
      <Select value={sortValue} onChange={handleSortChange} width="150px">
        <Option value="newest">新しい順</Option>
        <Option value="oldest">古い順</Option>
        <Option value="updated">更新順</Option>
        <Option value="title">タイトル順</Option>
      </Select>
    </Box>
  );
}
