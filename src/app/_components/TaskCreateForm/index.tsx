"use client";

import { postTask } from "@/app/_services/postTask";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@yamada-ui/calendar";
import {
  Button,
  Fieldset,
  FormControl,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  useNotice,
  VStack,
} from "@yamada-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PostTaskData, postTaskSchema } from "./schema";

type Props = {
  lectureId?: string;
  onSuccess?: () => void;
};

const TaskCreateForm = ({ lectureId, onSuccess }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostTaskData>({
    resolver: zodResolver(postTaskSchema),
  });

  const notice = useNotice({
    style: { maxW: "80%", minW: "60%" },
    isClosable: true,
  });

  const onSubmit: SubmitHandler<PostTaskData> = async (data) => {
    try {
      await postTask({ lecture_id: lectureId, ...data });
      notice({
        title: "通知",
        description: "",
        status: "success",
        duration: 2000,
        variant: "left-accent",
      });
      onSuccess?.();
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message || "",
        status: "error",
        duration: 2000,
        variant: "left-accent",
      });
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!!errors.title}
        label="タイトル"
        errorMessage={errors.title?.message}
      >
        <Input placeholder="Ichipiro" {...register("title")} />
      </FormControl>

      <FormControl
        isInvalid={!!errors.description}
        label="詳細"
        errorMessage={errors.description?.message}
      >
        <Textarea {...register("description")} />
      </FormControl>

      <Fieldset
        invalid={!!errors.priority}
        legend="優先度"
        errorMessage={errors.priority ? errors.priority.message : undefined}
      >
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              <Radio value="0">低</Radio>
              <Radio value="1">中</Radio>
              <Radio value="2">高</Radio>
            </RadioGroup>
          )}
        />
      </Fieldset>

      <FormControl
        invalid={!!errors.due_date}
        label="締め切り"
        errorMessage={errors.due_date ? errors.due_date.message : undefined}
      >
        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <DatePicker placeholder="YYYY/MM/DD" {...field} />
          )}
        />
      </FormControl>

      <Button type="submit" alignSelf="flex-end">
        追加
      </Button>
    </VStack>
  );
};

export default TaskCreateForm;
