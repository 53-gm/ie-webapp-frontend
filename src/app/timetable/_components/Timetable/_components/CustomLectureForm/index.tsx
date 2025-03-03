import { CreateLectureInput } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  HStack,
  Input,
  MultiSelect,
  NumberInput,
  SelectItem,
  Tab,
  TabPanel,
  Tabs,
  Textarea,
  useNotice,
  VStack,
} from "@yamada-ui/react";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { createLecture } from "./action";
import { createLectureSchema } from "./schema";

interface CustomLectureFormProps {
  defaultValues?: Partial<CreateLectureInput>;
  onChangeCustomFormData?: (data: Partial<CreateLectureInput>) => void;
  onRegisterSuccess: (data: any) => void;
}

const CustomLectureForm: React.FC<CustomLectureFormProps> = ({
  defaultValues = {},
  onChangeCustomFormData,
  onRegisterSuccess,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<createLectureSchema>({
    resolver: zodResolver(createLectureSchema),
    defaultValues: {
      // day/timeを固定的に入れたいならここで
      ...defaultValues,
      units: defaultValues.units ?? 0,
    },
  });

  const notice = useNotice({ isClosable: true });

  // フォームの内容が変わったら親へ通知
  const watchAll = watch();
  useEffect(() => {
    onChangeCustomFormData?.(watchAll);
  }, [watchAll, onChangeCustomFormData]);

  const onSubmit: SubmitHandler<createLectureSchema> = async (data) => {
    try {
      await createLecture(data as CreateLectureInput);
      notice({
        title: "通知",
        description: "講義の登録に成功しました",
        status: "success",
      });
      onRegisterSuccess(data);
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message || "講義の登録に失敗しました",
        status: "error",
      });
    }
  };

  const scheduleItems: SelectItem[] = [];
  for (let day = 1; day <= 7; day++) {
    for (let time = 1; time <= 5; time++) {
      const item: SelectItem = {
        label:
          ["月", "火", "水", "木", "金", "土", "日"][day - 1] +
          "曜日" +
          time +
          "限",
        value: String((day - 1) * 5 + time),
      };
      scheduleItems.push(item);
    }
  }

  const termItems: SelectItem[] = [
    { label: "第1ターム", value: "1" },
    { label: "第2ターム", value: "2" },
    { label: "第3ターム", value: "3" },
    { label: "第4ターム", value: "4" },
  ];

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)} w="full">
      <Tabs w="full">
        <Tab>基本設定</Tab>
        <Tab>詳細設定</Tab>

        <TabPanel>
          <VStack align="start" w="full">
            <FormControl
              isInvalid={!!errors.name}
              label="講義名"
              errorMessage={errors.name?.message}
            >
              <Input placeholder="Lecture" {...register("name")} />
            </FormControl>

            <FormControl
              isInvalid={!!errors.room}
              label="教室"
              errorMessage={errors.room?.message}
            >
              <Input placeholder="講404" {...register("room")} />
            </FormControl>

            <FormControl
              isInvalid={!!errors.instructor}
              label="教員"
              errorMessage={errors.instructor?.message}
            >
              <Input placeholder="いちぴろくん" {...register("instructor")} />
            </FormControl>

            <FormControl
              isInvalid={!!errors.description}
              label="詳細"
              errorMessage={errors.description?.message}
            >
              <Textarea
                placeholder="何か書くことがあれば..."
                {...register("description")}
              />
            </FormControl>
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack align="start" w="full">
            <FormControl
              isInvalid={!!errors.eval_method}
              label="評価方法"
              errorMessage={errors.eval_method?.message}
            >
              <Textarea placeholder="評価" {...register("eval_method")} />
            </FormControl>

            <FormControl
              isInvalid={!!errors.biko}
              label="備考"
              errorMessage={errors.biko?.message}
            >
              <Textarea placeholder="備考" {...register("biko")} />
            </FormControl>

            <HStack w="full">
              <FormControl
                isInvalid={!!errors.term_ids}
                label="ターム(複数可)"
                errorMessage={errors.term_ids?.message}
              >
                <Controller
                  name="term_ids"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      placeholder="タームを選択"
                      {...field}
                      items={termItems}
                    />
                  )}
                />
              </FormControl>

              <FormControl
                isInvalid={!!errors.units}
                label="単位数"
                errorMessage={errors.units?.message}
              >
                <Controller
                  name="units"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      min={0}
                      max={10}
                      isStepper={false}
                    />
                  )}
                />
              </FormControl>
            </HStack>

            <FormControl
              isInvalid={!!errors.schedule_ids}
              label="日程(複数可)"
              errorMessage={errors.schedule_ids?.message}
            >
              <Controller
                name="schedule_ids"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    placeholder="日程を選択"
                    {...field}
                    items={scheduleItems}
                  />
                )}
              />
            </FormControl>
          </VStack>
        </TabPanel>
      </Tabs>

      <Button variant="outline" type="submit" w="full" mt={4}>
        決定
      </Button>
    </VStack>
  );
};

export default CustomLectureForm;
