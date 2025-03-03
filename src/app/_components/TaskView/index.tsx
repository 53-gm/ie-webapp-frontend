import { Task } from "@/types/api";
import { Card, CardBody, CardHeader, Heading, Text } from "@yamada-ui/react";

type Props = {
  task: Task;
};

const TaskView = ({ task }: Props) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{task.title}</Heading>
      </CardHeader>

      <CardBody>
        <Text>{task.description}</Text>
      </CardBody>
    </Card>
  );
};

export default TaskView;
