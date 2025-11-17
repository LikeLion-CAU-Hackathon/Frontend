import styled from "styled-components";
import Overlay from "../Overlay/Overlay";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  confirmLabel?: string;
}

const Modal = ({ isOpen, message, onClose, confirmLabel = "확인" }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
    <Overlay isVisible={true} bgColor={"rgba(0,0,0,0.6)"} disablePointerEvents />
      <ModalSection>
      <Dialog role="dialog" aria-modal="true">
        <Message>{message}</Message>
        <ActionButton type="button" onClick={onClose}>
          {confirmLabel}
        </ActionButton>
      </Dialog>
      </ModalSection>
    </>
  );
};

export default Modal;

const ModalSection = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: "Gowun Batang";
`;

const Dialog = styled.div`
  width: calc(100% - 48px);
  max-width: 280px;
  background: #DECBA1;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #111;
  white-space: pre-line;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 5px 30px;
  background: black;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  outline: none;
`;

