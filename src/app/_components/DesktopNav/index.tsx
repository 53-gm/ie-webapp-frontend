import {
  CalendarIcon,
  HouseIcon,
  InfoIcon,
  LibraryIcon,
  SettingsIcon,
} from "@yamada-ui/lucide";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Spacer,
  Tooltip,
  VStack,
} from "@yamada-ui/react";
import Link from "next/link";
import React from "react";

type NavItemProps = {
  label: String;
  icon: any;
  url: any;
};

const NavItem: React.FC<NavItemProps> = ({ label, icon, url }) => {
  return (
    <Flex>
      <Tooltip
        label={label}
        fontSize="sm"
        placement="right-start"
        openDelay={200}
      >
        <Link href={url}>
          <IconButton
            variant="link"
            color="gray.400"
            _hover={{ color: "gray.800" }}
            icon={icon}
          />
        </Link>
      </Tooltip>
    </Flex>
  );
};

const DesktopNav = () => {
  return (
    <Box
      borderRightWidth="1px"
      borderColor="gray.100"
      position="fixed"
      py="md"
      h="full"
      display={{ base: "", sm: "none" }}
      backgroundColor={["white", "black"]}
    >
      <VStack px="sm" h="full" gap="md" align="center">
        <Flex>
          <Link href="/">
            <IconButton
              variant="link"
              icon={
                <Image
                  src="/ichipiroexplorer.png"
                  width="48px"
                  height="48px"
                  bgColor="blackAlpha.900"
                  borderRadius="full"
                />
              }
            />
          </Link>
        </Flex>
        <NavItem label="ホーム" icon={<HouseIcon fontSize="2xl" />} url="/" />

        <NavItem
          label="時間割"
          icon={<CalendarIcon fontSize="2xl" />}
          url="/timetable"
        />

        <NavItem
          label="記事"
          icon={<LibraryIcon fontSize="2xl" />}
          url="/articles"
        />

        <Spacer />

        <NavItem
          label="更新情報"
          icon={<InfoIcon fontSize="2xl" />}
          url="/infomation"
        />

        <NavItem
          label="設定"
          icon={<SettingsIcon fontSize="2xl" />}
          url="/settings"
        />
      </VStack>
    </Box>
  );
};

export default DesktopNav;
