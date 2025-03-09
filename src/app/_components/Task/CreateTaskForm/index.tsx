"use client";

import { getLectures } from "@/actions/lectures";
import { ApiResult } from "@/lib/api/client";
import { Lecture } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@yamada-ui/calendar";
import {
  Box,
  Button,
  FormControl,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TaskFormValues, taskSchema } from "../schema";

interface CreateTaskFormProps {
  onSubmit: (data: TaskFormValues) => Promise<boolean>;
  onSuccess?: () => void;
  hideLectureField?: boolean; // 講義フィールドを非表示にするかどうか
  defaultLectureId?: string; // デフォルトの講義ID
  compact?: boolean; // コンパクト表示モード
}

export default function CreateTaskForm({
  onSubmit,
  onSuccess,
  hideLectureField = false,
  defaultLectureId,
  compact = false,
}: CreateTaskFormProps) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      lecture_id: defaultLectureId,
      priority: 1,
      status: 0,
    },
  });

  // 講義一覧を取得（hideLectureField=falseの場合のみ）
  useEffect(() => {
    if (hideLectureField) return;

    const fetchLectures = async () => {
      try {
        const result: ApiResult<Lecture[]> = await getLectures();
        if (result.success && result.data) {
          setLectures(result.data);
        }
      } catch (error) {
        console.error("講義の取得に失敗しました:", error);
      }
    };

    fetchLectures();
  }, [hideLectureField]);

  const lectureItems: SelectItem[] = lectures.map((lecture) => ({
    label: lecture.name,
    value: lecture.id,
  }));

  const handleFormSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // defaultLectureIdが設定されていて、lecture_idが未設定の場合はdefaultLectureIdを使用
      if (defaultLectureId && !data.lecture_id) {
        data.lecture_id = defaultLectureId;
      }

      const success = await onSubmit(data);
      if (success) {
        reset();
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // コンパクトモードとフルモードでレイアウトを変更
  if (compact) {
    return (
      <Box
        as="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        bg="white"
        p={3}
        borderWidth="1px"
        borderRadius="md"
        shadow="sm"
      >
        <VStack>
          {/* タイトル */}
          <FormControl isInvalid={!!errors.title} isRequired>
            <Input placeholder="タスクのタイトル" {...register("title")} />
          </FormControl>

          {/* アクション */}
          <Button
            type="submit"
            colorScheme="blue"
            size="sm"
            alignSelf="flex-end"
            isLoading={isSubmitting}
          >
            追加
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      bg="white"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      shadow="sm"
    >
      <VStack>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} width="full">
          {/* タイトル */}
          <GridItem colSpan={hideLectureField ? 12 : { base: 12, md: 6 }}>
            <FormControl isInvalid={!!errors.title} isRequired>
              <Input placeholder="タスクのタイトル" {...register("title")} />
            </FormControl>
          </GridItem>

          {/* 講義（オプション） */}
          {!hideLectureField && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormControl>
                <Controller
                  name="lecture_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="講義を選択（任意）"
                      {...field}
                      value={field.value || ""}
                      onChange={(value) => field.onChange(value || undefined)}
                      items={lectureItems}
                    />
                  )}
                />
              </FormControl>
            </GridItem>
          )}

          {/* 詳細 */}
          <GridItem colSpan={12}>
            <FormControl>
              <Textarea
                placeholder="タスクの詳細を入力してください"
                {...register("description")}
                rows={3}
              />
            </FormControl>
          </GridItem>

          {/* 期限 */}
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isInvalid={!!errors.due_date}>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    placeholder="YYYY/MM/DD"
                    {...field}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </FormControl>
          </GridItem>

          {/* 優先度 */}
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isInvalid={!!errors.priority}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={String(field.value)}
                    onChange={(value) => field.onChange(Number(value))}
                  >
                    <Radio value="0">低</Radio>
                    <Radio value="1">中</Radio>
                    <Radio value="2">高</Radio>
                  </RadioGroup>
                )}
              />
            </FormControl>
          </GridItem>

          {/* 状態 */}
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl isInvalid={!!errors.status}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={String(field.value)}
                    onChange={(value) => field.onChange(Number(value))}
                  >
                    <Radio value="0">未着手</Radio>
                    <Radio value="1">進行中</Radio>
                    <Radio value="2">完了</Radio>
                  </RadioGroup>
                )}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          type="submit"
          colorScheme="blue"
          alignSelf="flex-end"
          isLoading={isSubmitting}
        >
          タスクを作成
        </Button>
      </VStack>
    </Box>
  );
}
