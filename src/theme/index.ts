"use client";

import type { ThemeConfig } from "@yamada-ui/react";
import {
  extendConfig,
  extendTheme,
  UIStyle,
  UsageTheme,
} from "@yamada-ui/react";

const globalStyle: UIStyle = {
  body: {
    bg: ["#F5F9FA", "black"],
  },
};

const customTheme: UsageTheme = {
  styles: { globalStyle },
};

const customConfig: ThemeConfig = {
  initialColorMode: "light",
};

export const theme = extendTheme(customTheme)();
export const config = extendConfig(customConfig);
