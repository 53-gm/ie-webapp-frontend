import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// バリデーションスキーマ
const taskSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  description: z.string().optional(),
  priority: z.number().min(0).max(2),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  onSubmit: (data: TaskFormValues) => Promise<boolean>;
  onSuccess?: () => void;
}

export default function CreateTaskForm({
  onSubmit,
  onSuccess,
}: CreateTaskFormProps) {
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

  const handleFormSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
      onSuccess?.();
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      mb={4}
    >
      <VStack align="start">
        <FormControl isInvalid={!!errors.title}>
          <Input
            bg="white"
            placeholder="タスクのタイトル"
            {...register("title")}
          />
        </FormControl>

        <FormControl>
          <Textarea
            bg="white"
            placeholder="タスクの詳細"
            {...register("description")}
          />
        </FormControl>

        <FormControl>
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

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          alignSelf="flex-end"
        >
          追加
        </Button>
      </VStack>
    </Box>
  );
}
