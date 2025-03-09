"use client";

import { getLectures } from "@/actions/lectures";
import { ApiResult } from "@/lib/api/client";
import { Lecture, Task } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@yamada-ui/calendar";
import {
  Button,
  FormControl,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
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

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, data: TaskFormValues) => Promise<boolean>;
  task: Task | null;
  hideLectureField?: boolean; // 講義フィールドを非表示にするかどうか
}

export default function EditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  hideLectureField = false,
}: EditTaskModalProps) {
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

  // タスクが変更されたときにフォーム値をリセット
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        lecture_id: task.lecture?.id,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? new Date(task.due_date) : null,
      });
    }
  }, [task, reset]);

  const lectureItems: SelectItem[] = lectures.map((lecture) => ({
    label: lecture.name,
    value: lecture.id,
  }));

  const handleFormSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    if (!task) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(task.id, data);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalBody>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalHeader>タスクを編集</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack>
              <Grid templateColumns="repeat(12, 1fr)" gap={4} width="full">
                {/* タイトル */}
                <GridItem colSpan={hideLectureField ? 12 : { base: 12, md: 7 }}>
                  <FormControl isInvalid={!!errors.title} isRequired>
                    <Input
                      placeholder="タスクのタイトル"
                      {...register("title")}
                    />
                  </FormControl>
                </GridItem>

                {/* 講義（オプション） */}
                {!hideLectureField && (
                  <GridItem colSpan={{ base: 12, md: 5 }}>
                    <FormControl>
                      <Controller
                        name="lecture_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            placeholder="講義を選択（任意）"
                            {...field}
                            value={field.value || ""}
                            onChange={(value) =>
                              field.onChange(value || undefined)
                            }
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
              保存
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  );
}
