import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface AnswerButtonProps {
    width: string;
    height: string;
    fontSize: string;
    borderRadius: string;
    onClick?: () => void;
    to?: string;
    type?: "button" | "submit" | "reset";
    state?: unknown;
}

export default function AnswerButton({
  width,
  height,
  fontSize,
  onClick,
  borderRadius,
  to,
  state,
  type = "button",
}: AnswerButtonProps) {
  const navigate = useNavigate();
  const destination = to ?? "/answer";

  const navigateWithState = useCallback(() => {
    if (typeof state === "undefined") {
      navigate(destination);
    } else {
      navigate(destination, { state });
    }
  }, [destination, navigate, state]);

  const handleClick = useCallback(() => {
    try {
      const maybePromise = onClick?.();
      if (maybePromise && typeof (maybePromise as Promise<unknown>).then === "function") {
        (maybePromise as Promise<unknown>)
          .catch((error) => {
            console.error("AnswerButton onClick 에서 오류가 발생했습니다:", error);
          })
          .finally(() => navigateWithState());
        return;
      }
    } catch (error) {
      console.error("AnswerButton onClick 실행 중 오류가 발생했습니다:", error);
    }

    navigateWithState();
  }, [navigateWithState, onClick]);

  return (
    <ButtonWrapper
      type={type}
      $width={width}
      $height={height}
      $fontSize={fontSize}
      $borderRadius={borderRadius}
      onClick={handleClick}
    >
      답변하기
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button<{$width: string; $height: string; $borderRadius: string; $fontSize: string;}>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  font-size: ${({ $fontSize }) => $fontSize};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  cursor: pointer;
  background-color: #F3E5C5;
  font-weight: 600;
  word-wrap: break-word;
  cursor: pointer;
  opacity: 1;
  pointer-events: auto;
  color: black;
`;
