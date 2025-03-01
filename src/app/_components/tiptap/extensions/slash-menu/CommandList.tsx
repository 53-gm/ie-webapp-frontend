import React, { useEffect, useImperativeHandle, useState } from "react";
import { stopPrevent } from "../../utils";

import {
  Box,
  Button,
  Code,
  HStack,
  ScrollArea,
  Spacer,
  Text,
  VStack,
} from "@yamada-ui/react";

interface CommandListProps {
  items: any[];
  command: (...args: any[]) => any;
}

export const CommandList = React.forwardRef(
  ({ items, command }: CommandListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          stopPrevent(event);
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          stopPrevent(event);
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          stopPrevent(event);
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) setTimeout(() => command(item));
    };
    return (
      <ScrollArea h="xs" w="xs" rounded="md" shadow="md" justifyItems="center">
        <VStack gap="none">
          {items.length ? (
            <>
              {items.map((item, index) => {
                return (
                  <Button
                    variant="unstyled"
                    onClick={() => selectItem(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onKeyDown={(e) => e.code === "Enter" && selectItem(index)}
                    key={item.title}
                    bgColor={index == selectedIndex ? "gray.100" : ""}
                    margin="xs"
                  >
                    <HStack gap="sm" alignItems="baseline" marginX="md">
                      <Box fontSize="xl" color="gray.600">
                        {item.icon}
                      </Box>

                      <Text fontWeight="normal">{item.title}</Text>

                      <Spacer />

                      {item.shortcut && <Code>{item.shortcut}</Code>}
                    </HStack>
                  </Button>
                );
              })}
            </>
          ) : (
            <Text> No result </Text>
          )}
        </VStack>
      </ScrollArea>
    );
  }
);
