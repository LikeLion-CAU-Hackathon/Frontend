/* 답변 포스트잇 컴포넌트 */
import { useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styled from "styled-components";
import { useLike } from "../../hooks/useLike";
import commentIcon from "../../assets/images/Comments/comment.svg";

export interface AnswerCardData {
  id: number;
  author: string;
  date: string;
  time: string;
  contents: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

interface AnswerCardProps extends AnswerCardData {
  width?: string;
  height?: string;
  onSelect?: (answer: AnswerCardData, rect: DOMRect) => void;
}

const AnswerCard = ({
  id,
  author,
  date,
  time,
  contents,
  likes,
  comments,
  liked = false,
  width,
  height,
  onSelect,
}: AnswerCardProps) => {
  const { liked: isLiked, likeCount, handleLike } = useLike(liked, likes, id);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleCardClick = () => {
    if (!onSelect || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    onSelect(
      {
        id,
        author,
        date,
        time,
        contents,
        likes: likeCount,
        comments,
        liked: isLiked,
      },
      rect
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleLikeClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleLike();
  };

  const handleCommentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleCardClick();
  };

  return (
    <AnswerContainer
      ref={cardRef}
      $width={width}
      $height={height}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <AnswerWrapper>
        <CardHeader>
          {/* TODO: author 아이디와 현재 로그인한 아이디와 동일하다면 (나) 표시) */}
          <Info>
            <Label>From.</Label> <Value>{author}</Value>
          </Info>
          <Info>
            <Label>Date:</Label>{" "}
            <DateValue>
              {date} | {time}
            </DateValue>
          </Info>
        </CardHeader>
        <Divider />
        {/* <Divider marginSize={marginSize}/> */}
        <CardSection>
          <CardContent>{contents}</CardContent>
          <CardFooter>
            <Icon onClick={handleLikeClick}>
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              {likeCount}
            </Icon>
            <Icon
              onClick={handleCommentClick}
              role="button"
              aria-label="댓글 보기"
            >
              <img src={commentIcon} alt="" />
              {comments}
            </Icon>
          </CardFooter>
        </CardSection>
      </AnswerWrapper>
    </AnswerContainer>
  );
};

export default AnswerCard;

const AnswerContainer = styled.article<{ $width?: string; $height?: string }>`
  background: #decba1;
  font-family: Gowun Batang;
  font-weight: 400;
  word-wrap: break-word;
  font-size: 12px;
  width: ${({ $width }) => $width || "172px"};
  height: ${({ $height }) => $height || "242px"};
  cursor: pointer;
`;

const AnswerWrapper = styled.div`
  border: 1px solid #b39a63;
  margin: 4px;
  padding: 10px;
  height: calc(100% - 8px);
  display: flex;
  flex-direction: column;
  color: #b39a63;
`;

const CardHeader = styled.header`
  color: #000;
  margin-bottom: 5px;
`;

/* TODO: 스크롤바 수정 필요*/
const CardContent = styled.section`
  width: 100%;
  height: 130px;
  overflow-y: auto;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  display: flex;
  color: #000;
  text-align: left;
  font-family: "Gowun Batang", "MaruBuri", serif;
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-line;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Label = styled.span`
  font-weight: 700;
  color: #b39a63;
`;

const BaseValue = styled.span`
  font-family: "Gowun Batang";
  color: #000;
  font-weight: 400;
  font-size: 12px;
`;

const Value = styled(BaseValue)`
  font-size: 12px;
`;

const DateValue = styled(BaseValue)`
  font-size: 12px;
`;

const Info = styled.p`
  margin: 0;
  font-size: 12px;
  font-family: "Gowun Batang";
  color: #000;
`;
// const Divider = styled.div<{ marginSize?: number }>`
//   margin: ${({ marginSize }) => `0 ${marginSize}px`};

// `;

const Divider = styled.div`
  outline: 1px #b39a63 solid;
  outline-offset: -0.5px;
  margin-bottom: 15px;
`;

const CardFooter = styled.footer`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: flex-end;
  margin-top: auto;
  color: #000;
  font-size: 15px;
  font-family: "Gowun Batang", "MaruBuri", serif;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #000;
  font-size: 15px;

  svg,
  img {
    width: 18px;
    height: 18px;
  }
`;

const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 5px;
`;
