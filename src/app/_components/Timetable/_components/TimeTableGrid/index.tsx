import { Register } from "@/app/_services/type";
import { Grid, GridItem, Text, VStack } from "@yamada-ui/react";
import React from "react";

type Props = {
  registeredMap: Record<string, Register | undefined>;
  onCellClick: (day: number, time: number) => void;
};

const DAYS = [1, 2, 3, 4, 5, 6, 7];
const TIMES = [1, 2, 3, 4, 5];
const TIMES_VALUE = [
  "9:00~10:30",
  "10:40~12:10",
  "13:00~14:30",
  "14:40~16:10",
  "16:20~17:50",
];

const TimeTableGrid: React.FC<Props> = ({ registeredMap, onCellClick }) => {
  return (
    <Grid
      templateColumns={{
        base: "repeat(7, 180px) 60px",
        md: "repeat(7, 60px) 40px",
      }}
      templateRows="50px repeat(5, 120px)"
      gap={1}
    >
      {/* 曜日ヘッダー */}
      {DAYS.map((day) => (
        <GridItem key={day} textAlign={"center"} alignContent={"center"}>
          <Text>{["月", "火", "水", "木", "金", "土", "日"][day - 1]}曜日</Text>
        </GridItem>
      ))}
      <GridItem />

      {/* 講義セル */}
      {TIMES.map((time) => (
        <React.Fragment key={time}>
          {DAYS.map((day) => {
            const key = `${day}-${time}`;
            const lecture = registeredMap[key]?.lecture;
            return (
              <GridItem
                key={key}
                bg="white"
                p="md"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => onCellClick(day, time)}
              >
                <VStack
                  h="full"
                  w="full"
                  alignItems="center"
                  justifyContent="center"
                >
                  {lecture ? (
                    <>
                      <Text fontSize="sm">{lecture.name}</Text>

                      <Text fontSize="sm">{lecture.room || "教室未設定"}</Text>
                    </>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      クリックして追加
                    </Text>
                  )}
                </VStack>
              </GridItem>
            );
          })}

          {/* 時間表示 */}
          <GridItem position="relative">
            <Text
              fontWeight="bold"
              position="absolute"
              right="sm"
              top="50%"
              transform="translateY(-50%) rotate(90deg)"
              transformOrigin="center center"
            >
              {TIMES_VALUE[time - 1]}
            </Text>
          </GridItem>
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default TimeTableGrid;
