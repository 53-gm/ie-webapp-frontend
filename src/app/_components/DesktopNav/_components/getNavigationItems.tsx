"use client";

import {
  CalendarIcon,
  CircleCheckIcon,
  HouseIcon,
  InfoIcon,
  LibraryIcon,
  SettingsIcon,
} from "@yamada-ui/lucide";

export interface NavMenuItem {
  label: string;
  icon?: React.ReactNode;
  href: string;
  children?: NavMenuItem[];
}

// 現在のパスに基づいてナビゲーション構造を生成する関数
export const getNavigationItems = (pathname: string): NavMenuItem[] => {
  return [
    {
      label: "ホーム",
      icon: <HouseIcon />,
      href: "/",
    },
    {
      label: "時間割",
      icon: <CalendarIcon />,
      href: "/timetable",
    },
    {
      label: "タスク",
      icon: <CircleCheckIcon />,
      href: "/tasks",
    },
    {
      label: "記事",
      icon: <LibraryIcon />,
      href: "/articles",
      children: [
        {
          label: "新規作成",
          href: "/articles/new",
        },
        {
          label: "自分の記事",
          href: "/articles/my",
        },
      ],
    },
    {
      label: "設定",
      icon: <SettingsIcon />,
      href: "/settings",
      children: [
        {
          label: "プロフィール設定",
          href: "/settings/profile",
        },
        {
          label: "アカウント設定",
          href: "/settings/account",
        },
        {
          label: "表示設定",
          href: "/settings/display",
        },
        {
          label: "通知設定",
          href: "/settings/notifications",
        },
      ],
    },
    {
      label: "更新情報",
      icon: <InfoIcon />,
      href: "/information",
    },
  ];
};
