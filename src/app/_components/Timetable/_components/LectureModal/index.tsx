// LectureModal.tsx
import { Modal, ModalBody } from "@yamada-ui/react";
import React from "react";

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // 子要素を受け取ってモーダルに埋め込む
}

export const LectureModal: React.FC<LectureModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" minH="5xl">
      {/* HeaderやBodyなどは固定UIだけ */}
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
};
