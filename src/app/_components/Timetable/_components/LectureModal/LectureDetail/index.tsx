// LectureDetail.tsx
import TaskCreateForm from "@/app/_components/TaskCreateForm";
import TaskView from "@/app/_components/TaskView";
import { deleteRegistration } from "@/app/_services/deleteRegistration";
import { Register, Task } from "@/app/_services/type";
import {
  Button,
  HStack,
  Switch,
  Tab,
  TabPanel,
  Tabs,
  Text,
  useNotice,
  VStack,
} from "@yamada-ui/react";
import React from "react";

interface LectureDetailProps {
  register: Register;
  tasks?: Task[];
  onDeleteSuccess: () => void;
}

const LectureDetail: React.FC<LectureDetailProps> = ({
  register,
  tasks,
  onDeleteSuccess,
}) => {
  const lecture = register.lecture;
  const notice = useNotice({ isClosable: true });

  const handleDelete = async () => {
    try {
      await deleteRegistration({ registration_id: register.id });
      notice({
        title: "通知",
        description: "登録を削除しました",
        status: "success",
      });
      onDeleteSuccess();
    } catch (error: any) {
      notice({
        title: "エラー",
        description: error.message || "登録の削除に失敗しました",
        status: "error",
      });
    }
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        {lecture.name}
      </Text>

      <Tabs variant="rounded-subtle">
        <Tab>講義情報</Tab>
        <Tab>タスク管理</Tab>
        <Tab>設定</Tab>

        <TabPanel>
          <VStack align="start">
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
              <strong>詳細:</strong> {lecture.description}
            </Text>
            <Text>
              <strong>評価方法:</strong> {lecture.eval_method}
            </Text>
            {lecture.biko && (
              <Text>
                <strong>備考:</strong> {lecture.biko}
              </Text>
            )}
          </VStack>
        </TabPanel>
        <TabPanel>
          <VStack>
            {tasks &&
              tasks?.map((task) => {
                return <TaskView key={task.id} task={task} />;
              })}

            <TaskCreateForm lectureId={lecture.id} />
          </VStack>
        </TabPanel>
        <TabPanel>
          <VStack>
            <Switch colorScheme="green" defaultChecked>
              出席通知
            </Switch>
            <Button colorScheme="red" w="xs" onClick={handleDelete}>
              削除
            </Button>
          </VStack>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default LectureDetail;
