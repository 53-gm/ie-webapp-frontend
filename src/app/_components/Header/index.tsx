import { Center, Heading, HStack, Spacer } from "@yamada-ui/react";
import UserMenu from "./_components/UserMenu";

const Header = () => {
  return (
    <>
      <Center as="header" w="full" position="sticky" py="md">
        <HStack w="full" maxW="9xl" px={{ base: "lg", md: "md" }}>
          <Heading>Test App</Heading>
          <Spacer />

          <HStack>
            <UserMenu />
          </HStack>
        </HStack>
      </Center>
    </>
  );
};

export default Header;
