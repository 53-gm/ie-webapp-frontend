import { Lecture } from "@/types/api";
import { Box, Divider, Heading, Text, VStack } from "@yamada-ui/react";

interface LectureInfoTabProps {
  lecture: Lecture;
}

export default function LectureInfoTab({ lecture }: LectureInfoTabProps) {
  return (
    <VStack align="start">
      <Box w="full">
        <Heading size="md" mb={2}>
          概要
        </Heading>
        <Text whiteSpace="pre-wrap">
          {lecture.description || "概要情報が設定されていません"}
        </Text>
      </Box>

      <Divider />

      <Box w="full">
        <Heading size="md" mb={2}>
          評価方法
        </Heading>
        <Text whiteSpace="pre-wrap">
          {lecture.eval_method || "評価方法が設定されていません"}
        </Text>
      </Box>

      {lecture.biko && (
        <>
          <Divider />
          <Box w="full">
            <Heading size="md" mb={2}>
              備考
            </Heading>
            <Text whiteSpace="pre-wrap">{lecture.biko}</Text>
          </Box>
        </>
      )}
    </VStack>
  );
}
