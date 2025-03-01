import { auth, signIn, signOut } from "@/lib/auth";
import { UserIcon } from "@yamada-ui/lucide";
import {
  Avatar,
  Box,
  Center,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@yamada-ui/react";
import Link from "next/link";
import React from "react";

const UserMenu: React.FC = async () => {
  const session = await auth();
  return (
    <Box backgroundColor="white" borderRadius="full">
      <Menu animation="top">
        <MenuButton
          size="lg"
          as={IconButton}
          variant="unstyled"
          icon={
            session ? (
              <Avatar
                src={session?.user?.profile?.picture || ""}
                width="48px"
                height="48px"
                borderRadius="full"
              />
            ) : (
              <Center
                w="48px"
                height="48px"
                borderWidth="1px"
                borderRadius="full"
              >
                <UserIcon color="gray.400" fontSize="2xl" />
              </Center>
            )
          }
        />

        <MenuList>
          <MenuGroup
            label={session?.user?.profile?.display_name || "My Account"}
          >
            <Link href="/settings">
              <MenuItem>設定</MenuItem>
            </Link>
            <Link href="/">
              <MenuItem>サポート</MenuItem>
            </Link>
          </MenuGroup>

          {session ? (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Box as="button" type="submit" w="full">
                <MenuItem>サインアウト</MenuItem>
              </Box>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Box as="button" type="submit" w="full">
                <MenuItem>サインイン</MenuItem>
              </Box>
            </form>
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserMenu;
