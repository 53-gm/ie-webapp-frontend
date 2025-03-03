import { Lecture } from "@/types/api";
import { format } from "@formkit/tempo";
import { ArrowLeftIcon } from "@yamada-ui/lucide";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Tag,
  Text,
  VStack,
  Wrap,
} from "@yamada-ui/react";
import Link from "next/link";

interface LectureDetailHeaderProps {
  lecture: Lecture;
}

export default function LectureDetailHeader({
  lecture,
}: LectureDetailHeaderProps) {
  return (
    <Box
      w="full"
      bg="white"
      p={6}
      borderRadius="md"
      shadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <VStack align="start">
        <Flex w="full" align="center">
          <Link href="/timetable">
            <IconButton
              aria-label="戻る"
              icon={<ArrowLeftIcon />}
              variant="ghost"
              size="sm"
              mr={2}
            />
          </Link>

          <Heading size="lg">{lecture.name}</Heading>
        </Flex>

        <Wrap gap="xs">
          {lecture.is_required && <Tag colorScheme="red">必修</Tag>}
          {lecture.is_exam && <Tag colorScheme="purple">期末試験あり</Tag>}
          {lecture.terms.map((term) => (
            <Tag key={term.number} colorScheme="blue">
              第{term.number}ターム
            </Tag>
          ))}
          {lecture.departments.map((dept) => (
            <Tag colorScheme="teal">{dept.name}</Tag>
          ))}
        </Wrap>

        <HStack flexWrap="wrap">
          <HStack>
            <Text fontWeight="bold">担当教員:</Text>
            <Text>{lecture.instructor}</Text>
          </HStack>

          <HStack>
            <Text fontWeight="bold">教室:</Text>
            <Text>{lecture.room || "未設定"}</Text>
          </HStack>

          <HStack>
            <Text fontWeight="bold">単位数:</Text>
            <Text>{lecture.units}</Text>
          </HStack>

          <HStack>
            <Text fontWeight="bold">対象学年:</Text>
            <Text>{lecture.grade}年</Text>
          </HStack>
        </HStack>

        <HStack>
          <Text fontWeight="bold">開講日時:</Text>
          <Wrap gap="xs">
            {lecture.schedules.map((schedule) => (
              <Tag size="sm" key={`${schedule.day}-${schedule.time}`}>
                {["月", "火", "水", "木", "金", "土", "日"][schedule.day - 1]}曜
                {schedule.time}限
              </Tag>
            ))}
          </Wrap>
        </HStack>

        <HStack fontSize="sm" color="gray.500">
          <Text>登録日: {format(lecture.created_at, "short")}</Text>
          {lecture.created_at !== lecture.updated_at && (
            <Text>更新日: {format(lecture.updated_at, "short")}</Text>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
