import DesktopNav from "@/app/_components/DesktopNav";
import Header from "@/app/_components/Header";
import "@/lib/tiptap/styles/tiptap.css";
import { Center, VStack } from "@yamada-ui/react";
import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import { ReactNode } from "react";
import YamadaUIProvider from "./_components/YamadaUIProvider";
import "./globals.css";

const ZenKakuGothicNewFont = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  applicationName: "iewebapp",
  title: {
    default: "iewebapp",
    template: "iewebapp",
  },
  description: "iewebapp",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iewebapp",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "iewebapp",
    title: {
      default: "iewebapp",
      template: "iewebapp",
    },
    description: "iewebapp",
  },
  twitter: {
    card: "summary",
    title: {
      default: "iewebapp",
      template: "iewebapp",
    },
    description: "iewebapp",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={ZenKakuGothicNewFont.className}>
        <YamadaUIProvider>
          <DesktopNav />
          <VStack px={{ base: "2xl", sm: "xs" }} minH="100vh">
            <Header />
            <Center as="main" w="full">
              <VStack
                w="full"
                gap={{ base: "lg", md: "md" }}
                py="lg"
                px={{ base: "lg", md: "md" }}
                maxW="6xl"
                alignItems="center"
              >
                {children}
              </VStack>
            </Center>
          </VStack>
        </YamadaUIProvider>
      </body>
    </html>
  );
}
