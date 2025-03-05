"use client";

import MyProfileEditForm from "@/app/_components/MyProfileEditForm";
import { Department, Faculty } from "@/types/api";
import { Tab, TabPanel, Tabs } from "@yamada-ui/react";
import { User } from "next-auth";

type Props = {
  departments: Department[];
  faculties: Faculty[];
  user: User;
};

const SettingTabs = ({ departments, faculties, user }: Props) => {
  return (
    <Tabs orientation="vertical" variant="rounded" gap="xl">
      <Tab>プロフィール</Tab>
      <TabPanel>
        <MyProfileEditForm
          departments={departments}
          faculties={faculties}
          user={user}
        />
      </TabPanel>

      <Tab>アカウント</Tab>
      <TabPanel></TabPanel>

      <Tab>通知</Tab>
      <TabPanel></TabPanel>
    </Tabs>
  );
};

export default SettingTabs;
