import styled from "styled-components";

interface OverlayProps {
    isVisible: boolean;
    onClick?: () => void;
    bgColor?: string;
    disablePointerEvents?: boolean;
}

const Overlay = ({ isVisible, onClick, bgColor, disablePointerEvents = false } : OverlayProps) => {
    return (
        <OverlayBackground
            $isVisible={isVisible}
            onClick={onClick}
            $bgColor={bgColor}
            $disablePointerEvents={disablePointerEvents}
        />
    );
}

export default Overlay;

const OverlayBackground = styled.div<{ $isVisible: boolean; $bgColor?: string; $disablePointerEvents: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ $bgColor }) => $bgColor || "rgba(0,0,0,0.4)"};
  opacity: ${({ $isVisible}) => ( $isVisible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out; // 편지지 올라오는거랑 맞추기
  z-index: 0; 
  pointer-events: ${({ $disablePointerEvents }) => ($disablePointerEvents ? "none" : "auto")};
`;
