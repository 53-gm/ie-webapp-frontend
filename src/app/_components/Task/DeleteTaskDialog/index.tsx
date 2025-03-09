"use client";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  Text,
} from "@yamada-ui/react";
import { useState } from "react";

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<boolean>;
}

export default function DeleteTaskDialog({
  isOpen,
  onClose,
  onDelete,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await onDelete();
      if (success) {
        onClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogOverlay />
      <DialogBody>
        <DialogHeader>タスクの削除</DialogHeader>

        <Text>このタスクを削除しますか？この操作は取り消せません。</Text>

        <DialogFooter>
          <Button onClick={onClose}>キャンセル</Button>
          <Button
            colorScheme="red"
            isLoading={isDeleting}
            onClick={handleConfirmDelete}
            ml={3}
          >
            削除
          </Button>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
}
