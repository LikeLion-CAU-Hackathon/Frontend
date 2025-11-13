import styled from "styled-components";

interface AnswerButtonProps {
    width: string;
    height: string;
    fontSize: string;
    borderRadius: string;
    onClick?: () => void;
}

export default function AnswerButton( {width, height, fontSize, onClick, borderRadius} : AnswerButtonProps) {
    return (
        <ButtonWrapper $width={width} $height={height} $fontSize={fontSize} $borderRadius={borderRadius} onClick={onClick}>
            답변하기
        </ButtonWrapper>
    )
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
`;