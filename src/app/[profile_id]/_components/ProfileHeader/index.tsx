import { UserProfile } from "@/types/api";
import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react";

interface ProfileHeaderProps {
  profile: UserProfile;
  articlesCount: number;
}

export default function ProfileHeader({
  profile,
  articlesCount,
}: ProfileHeaderProps) {
  return (
    <Box
      as="section"
      py={8}
      borderBottomWidth="1px"
      borderColor="gray.200"
      bg="gray.50"
    >
      <Container maxW="4xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "flex-start" }}
          gap={6}
        >
          <Avatar
            src={profile.picture || undefined}
            name={profile.display_name || profile.email}
            size="2xl"
            border="4px solid white"
            shadow="md"
          />

          <VStack align="start" flex={1}>
            <VStack align="start">
              <Heading size="xl">{profile.display_name || "ユーザー"}</Heading>
              <Text color="gray.600" fontSize="sm">
                @{profile.profile_id}
              </Text>
            </VStack>

            <HStack wrap="wrap">
              <HStack>
                <Text fontWeight="bold">{articlesCount}</Text>
                <Text color="gray.600">記事</Text>
              </HStack>

              {profile.faculty && (
                <Tag colorScheme="blue" size="md">
                  {profile.faculty.name}
                </Tag>
              )}

              {profile.department && (
                <Tag colorScheme="green" size="md">
                  {profile.department.name}
                </Tag>
              )}

              {profile.grade && (
                <Tag colorScheme="purple" size="md">
                  {profile.grade}年生
                </Tag>
              )}
            </HStack>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
