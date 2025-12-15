import Overlay from "../../../components/common/overlay/Overlay";
import Modal from "../../../components/common/modal/Modal";

interface Props {
  isCardOpened: boolean;
  onCloseLetter: () => void;
  modalMessage: string | null;
  onCloseModal: () => void;
}

const CalendarOverlay = ({ isCardOpened, onCloseLetter, modalMessage, onCloseModal }: Props) => {
  return (
    <>
      {isCardOpened && <Overlay isVisible onClick={onCloseLetter} />}
      {modalMessage && (
        <Modal isOpen={Boolean(modalMessage)} message={modalMessage} onClose={onCloseModal} />
      )}
    </>
  );
};

export default CalendarOverlay;

