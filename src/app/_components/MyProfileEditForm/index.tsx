"use client";

import { Department, Faculty } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  Input,
  NumberInput,
  Select,
  SelectItem,
  useNotice,
  VStack,
} from "@yamada-ui/react";
import { User } from "next-auth";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { updateUserProfile } from "./action";
import { PostProfileData, postProfileSchema } from "./schema";

type Props = {
  departments: Department[];
  faculties: Faculty[];
  user: User;
  onSuccess?: (data: PostProfileData) => void;
};

const MyProfileEditForm = ({
  departments,
  faculties,
  user,
  onSuccess,
}: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostProfileData>({
    resolver: zodResolver(postProfileSchema),
    defaultValues: {
      profile_id: user.profile.profile_id,
      display_name: user.profile.display_name || "",
      faculty_id: String(user.profile.faculty?.id) || "",
      department_id: String(user.profile.department?.id) || "",
      grade: user.profile.grade || 1,
    },
  });

  const notice = useNotice({
    style: { maxW: "80%", minW: "60%" },
    isClosable: true,
  });

  const [nowFaculty, setFaculty] = useState<string>(
    String(user.profile.faculty?.id) || ""
  );

  const facultyItems: SelectItem[] = faculties.map((faculty) => ({
    label: faculty.name,
    value: String(faculty.id),
  }));

  const availableDepartments = departments.filter(
    (department) => String(department.faculty.id) == nowFaculty
  );
  const departmentItems: SelectItem[] = availableDepartments.map(
    (department) => ({
      label: department.name,
      value: String(department.id),
    })
  );

  const onSubmit: SubmitHandler<PostProfileData> = async (data) => {
    try {
      await updateUserProfile(data);
      notice({
        title: "通知",
        description: "プロフィールが更新されました。",
        status: "success",
        duration: 2000,
        variant: "left-accent",
      });
      onSuccess?.(data);
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message || "プロフィールの更新に失敗しました。",
        status: "error",
        duration: 2000,
        variant: "left-accent",
      });
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!!errors.display_name}
        label="名前(表示名)"
        errorMessage={errors.display_name?.message}
      >
        <Input placeholder="Ichipiro" {...register("display_name")} />
      </FormControl>

      <FormControl
        isInvalid={!!errors.profile_id}
        label="ユーザーID"
        errorMessage={errors.profile_id?.message}
      >
        <Input placeholder="Ichipiro0003" {...register("profile_id")} />
      </FormControl>

      <FormControl
        isInvalid={!!errors.faculty_id}
        label="学部"
        errorMessage={errors.faculty_id?.message}
      >
        <Controller
          name="faculty_id"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="学部を選択"
              {...field}
              items={facultyItems}
              onChange={(value) => {
                field.onChange(value);
                setFaculty(value);
              }}
            />
          )}
        />
      </FormControl>

      <FormControl
        isInvalid={!!errors.department_id}
        label="学科"
        errorMessage={errors.department_id?.message}
      >
        <Controller
          name="department_id"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="学科を選択"
              {...field}
              items={departmentItems}
            />
          )}
        />
      </FormControl>

      <FormControl
        isInvalid={!!errors.grade}
        label="学年"
        errorMessage={errors.grade?.message}
      >
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              min={1}
              max={4}
              onChange={(value) => field.onChange(Number(value))}
            />
          )}
        />
      </FormControl>

      <Button type="submit" alignSelf="flex-end">
        決定
      </Button>
    </VStack>
  );
};

export default MyProfileEditForm;
