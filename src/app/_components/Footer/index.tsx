import { GithubIcon } from "@yamada-ui/lucide";
import { Box, HStack, Image, Link, Text, VStack } from "@yamada-ui/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" py="md" px={{ base: "lg", md: "md" }} mt="lg" w="full">
      <VStack align="center" maxW="6xl" mx="auto">
        {/* ロゴと名前 */}
        <HStack>
          <Image
            src="/ichipiroexplorer.png"
            width="36px"
            height="36px"
            borderRadius="full"
            alt="いちぴろ・エクスプローラ"
          />
          <Text fontSize="lg" fontWeight="bold">
            いちぴろ・エクスプローラ
          </Text>
        </HStack>

        {/* リンク部分 */}
        <HStack fontSize="sm" color="gray.600" flexWrap="wrap" justify="center">
          <Link href="/" _hover={{ color: "blue.500" }}>
            ホーム
          </Link>
          <Link href="/timetable" _hover={{ color: "blue.500" }}>
            時間割
          </Link>
          <Link href="/articles" _hover={{ color: "blue.500" }}>
            記事
          </Link>
          <Link href="/settings" _hover={{ color: "blue.500" }}>
            設定
          </Link>
          <Link href="/privacy" _hover={{ color: "blue.500" }}>
            プライバシーポリシー
          </Link>
          <Link href="/terms" _hover={{ color: "blue.500" }}>
            利用規約
          </Link>
        </HStack>

        {/* 著作権表示 */}
        <Text fontSize="xs" color="gray.500">
          © {currentYear} いちぴろ・エクスプローラ. All rights reserved.
        </Text>

        {/* 制作者とGitHubへのリンク */}
        <HStack fontSize="xs" color="gray.500">
          <Text>いちぴろ・エクスプローラによって制作されました</Text>

          <Link
            href="https://github.com/ichipiro"
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ color: "blue.500" }}
          >
            <GithubIcon fontSize={14} />
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Footer;
