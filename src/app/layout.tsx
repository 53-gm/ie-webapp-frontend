import Header from "@/app/_components/Header";
import "@/lib/tiptap/styles/tiptap.css";
import { Center, HStack, VStack } from "@yamada-ui/react";
import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import { ReactNode } from "react";
import DesktopNav from "./_components/DesktopNav";
import Footer from "./_components/Footer";
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
          <Center>
            <VStack minH="100vh" maxW="9xl">
              <Header />

              <HStack w="full" alignItems="stretch">
                <DesktopNav />

                <VStack
                  w="full"
                  gap={{ base: "lg", md: "md" }}
                  py="lg"
                  px={{ base: "lg", md: "md" }}
                  alignItems="center"
                  as="main"
                >
                  {children}
                </VStack>
              </HStack>
            </VStack>
          </Center>
          <Footer />
        </YamadaUIProvider>
      </body>
    </html>
  );
}
