// LectureList.tsx
import { postRegistLecture } from "@/app/_services/postRegistLecture";
import { Lecture } from "@/app/_services/type";
import {
  Box,
  Button,
  Divider,
  HStack,
  Tag,
  Text,
  VStack,
  useNotice,
} from "@yamada-ui/react";
import React from "react";

type LectureListProps = {
  lectures: Lecture[];
  onRegisterSuccess: () => void;
  onCopyLectureToCustom: (lecture: Lecture) => void; // カスタムコピー時のコールバック
};

export const LectureList: React.FC<LectureListProps> = ({
  lectures,
  onRegisterSuccess,
  onCopyLectureToCustom,
}) => {
  const notice = useNotice({ isClosable: true });

  const handleRegister = async (id: string) => {
    try {
      await postRegistLecture({ lecture_id: id, year: 2024 });
      notice({
        title: "通知",
        description: "講義を登録しました",
        status: "success",
      });
      onRegisterSuccess();
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message || "講義の登録に失敗しました",
        status: "error",
      });
    }
  };

  return (
    <>
      {lectures.map((lecture) => (
        <Box
          key={lecture.id}
          border="1px solid"
          borderColor="gray.300"
          p="md"
          borderRadius="md"
          bg="white"
          w="full"
        >
          <VStack align="start">
            <HStack>
              <Text fontSize="xl" fontWeight="bold">
                {lecture.name} ({lecture.id})
              </Text>
              {lecture.is_required && (
                <Tag variant="solid" colorScheme="red">
                  必修
                </Tag>
              )}
              {lecture.is_exam && <Tag variant="solid">期末テスト</Tag>}
            </HStack>
            <Divider />

            <Text>
              <strong>担当教員:</strong> {lecture.instructor}
            </Text>

            <HStack>
              <Text>
                <strong>教室:</strong> {lecture.room}
              </Text>
              <Text>
                <strong>単位数:</strong> {lecture.units}
              </Text>
            </HStack>

            <Text>
              <strong>評価方法:</strong> {lecture.eval_method}
            </Text>
            {lecture.biko && (
              <Text>
                <strong>備考:</strong> {lecture.biko}
              </Text>
            )}
            <Divider />

            <HStack>
              {/* 既存の講義を登録 */}
              <Button
                colorScheme="blue"
                onClick={() => handleRegister(lecture.id)}
              >
                登録
              </Button>

              {/* カスタム講義として編集 */}
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={() => onCopyLectureToCustom(lecture)}
              >
                カスタムで編集
              </Button>
            </HStack>
          </VStack>
        </Box>
      ))}
    </>
  );
};
