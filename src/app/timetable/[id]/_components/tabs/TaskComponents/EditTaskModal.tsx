import { Task } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// バリデーションスキーマ
const taskSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  description: z.string().optional(),
  priority: z.number().min(0).max(2),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, data: TaskFormValues) => Promise<boolean>;
  task: Task | null;
  taskId: string | null;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  taskId,
}: EditTaskModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: 1,
    },
  });

  // タスクが変更されたらフォームをリセット
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
      });
    }
  }, [task, reset]);

  const handleFormSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    if (!taskId) return;

    const success = await onSubmit(taskId, data);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalHeader>タスクを編集</ModalHeader>

      <ModalBody>
        <Box
          as="form"
          id="edit-task-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          w="full"
        >
          <VStack align="start">
            <FormControl isInvalid={!!errors.title} mb={3}>
              <Input placeholder="タスクのタイトル" {...register("title")} />
            </FormControl>

            <FormControl mb={3}>
              <Textarea
                placeholder="タスクの詳細"
                {...register("description")}
              />
            </FormControl>

            <FormControl mb={3}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={String(field.value)}
                    onChange={(val) => field.onChange(Number(val))}
                  >
                    <HStack>
                      <Radio value="0">低</Radio>
                      <Radio value="1">中</Radio>
                      <Radio value="2">高</Radio>
                    </HStack>
                  </RadioGroup>
                )}
              />
            </FormControl>
          </VStack>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button mr={3} onClick={onClose}>
          キャンセル
        </Button>
        <Button
          type="submit"
          form="edit-task-form"
          colorScheme="blue"
          isLoading={isSubmitting}
        >
          保存
        </Button>
      </ModalFooter>
    </Modal>
  );
}
