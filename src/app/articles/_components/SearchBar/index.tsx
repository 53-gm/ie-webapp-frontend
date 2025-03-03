"use client";

import { SearchIcon } from "@yamada-ui/lucide";
import { Box, Input, InputGroup, InputLeftElement } from "@yamada-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchBarProps {
  defaultQuery?: string;
}

export default function SearchBar({ defaultQuery = "" }: SearchBarProps) {
  // useStateの初期値を空にし、useEffectで適切なタイミングで設定
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // マウント後にdefaultQueryを設定して、ハイドレーションエラーを防ぐ
  useEffect(() => {
    setSearchQuery(defaultQuery);
  }, [defaultQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString());

    // 検索クエリを設定または削除
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }

    // パラメータを付けてナビゲーション
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box w={{ base: "full", md: "auto" }}>
      <form onSubmit={handleSearch}>
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="記事を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            borderRadius="md"
            width={{ base: "full", md: "300px" }}
          />
        </InputGroup>
      </form>
    </Box>
  );
}
