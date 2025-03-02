// components/ErrorBoundary.tsx
"use client";

import { Box, Button, Heading, Text, VStack } from "@yamada-ui/react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "エラーバウンダリがエラーをキャッチしました:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} textAlign="center">
          <VStack>
            <Heading>問題が発生しました</Heading>
            <Text>申し訳ありませんが、エラーが発生しました。</Text>
            {this.state.error && (
              <Text color="red.500" fontSize="sm">
                {this.state.error.message}
              </Text>
            )}
            <Button
              colorScheme="blue"
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              ページを再読み込み
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
