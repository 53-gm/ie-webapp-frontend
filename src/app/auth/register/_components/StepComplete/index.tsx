import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
} from "@yamada-ui/react";

type Props = {
  onStepNext: () => void;
  onStepPrev: () => void;
};

export function StepComplete({ onStepNext, onStepPrev }: Props) {
  return (
    <Card variant="outline" bg="white" p="md" maxW="4xl" w="4xl">
      <CardHeader>
        <Heading size="xl">登録完了</Heading>
      </CardHeader>

      <CardBody>
        <Link href="/">
          <Button>ダッシュボードへ</Button>
        </Link>
      </CardBody>
    </Card>
  );
}
