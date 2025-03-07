"use client";

import { HStack, Icon, Text } from "@yamada-ui/react";
import Link from "next/link";

type NavItemProps = {
  label: string;
  icon?: React.ReactNode;
  href: string;
  isHighlight: boolean;
  onClick: () => void;
};

// 単一のナビゲーション項目コンポーネント
const NavItem = ({ label, icon, href, isHighlight, onClick }: NavItemProps) => {
  return (
    <Link
      href={href}
      passHref
      style={{ textDecoration: "none", width: "100%" }}
      onClick={onClick}
    >
      <HStack w="full">
        {icon && <Icon as={() => icon} boxSize="18px" />}

        <Text as={isHighlight ? "u" : "p"}>{label}</Text>
      </HStack>
    </Link>
  );
};

export default NavItem;
