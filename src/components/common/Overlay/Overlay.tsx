import styled from "styled-components";

interface OverlayProps {
    isVisible: boolean;
    onClick?: () => void;
}

const Overlay = ({ isVisible, onClick } : OverlayProps) => {
    return <OverlayBackground $isVisible={isVisible} onClick={onClick} />
}

export default Overlay;

const OverlayBackground = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: ${({ $isVisible}) => ( $isVisible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out; // 편지지 올라오는거랑 맞추기
  z-index: 1; 
  pointer-events: auto;
`;