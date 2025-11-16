/* 답변 포스트잇 컴포넌트 */
import { useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from "react-icons/ai";
import styled from "styled-components";
import { useLike } from "../../hooks/useLike";

export interface AnswerCardData {
    id: number;
    author: string;
    date: string;
    time: string;
    contents: string;
    likes: number;
    comments : number;
    liked?: boolean;
}

interface AnswerCardProps extends AnswerCardData {
    width?: string;
    height?: string;
    onSelect?: (answer: AnswerCardData, rect: DOMRect) => void;
}

const AnswerCard = ({ id, author, date, time, contents, likes, comments, liked = false, width, height, onSelect } : AnswerCardProps) => {
    const { liked: isLiked, likeCount, handleLike } = useLike(liked, likes, id);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const handleCardClick = () => {
        if (!onSelect || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        onSelect({ id, author, date, time, contents, likes: likeCount, comments, liked: isLiked }, rect);
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
        // TODO: 댓글 보기 이벤트 연결 필요
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
                    <Label>Date:</Label> <Value>{date} | {time}</Value>
                </Info>
                </CardHeader>
                <Divider />
                {/* <Divider marginSize={marginSize}/> */}
                <CardContent>
                    {contents}
                </CardContent>
                <CardFooter>
                    <Icon onClick={handleLikeClick}>
                        {isLiked ? (
                        <AiFillHeart />
                    ) : (
                        <AiOutlineHeart />
                    )}
                    {likeCount}
                    </Icon>
                    <Icon onClick={handleCommentClick} role="button" aria-label="댓글 보기">
                        <AiOutlineComment /> 
                        {comments}
                    </Icon>
                </CardFooter>
            </AnswerWrapper>
        </AnswerContainer>
    )
}

export default AnswerCard;

const AnswerContainer = styled.article<{ $width?: string; $height?: string}>`
  background: #DECBA1;
  font-family: Gowun Batang;
  font-weight: 400;
  word-wrap: break-word;
  font-size: 12px;
  width: ${({ $width }) => $width || "172px"};
  height: ${({ $height }) => $height || "242px"};
  cursor: pointer;
`;

const AnswerWrapper = styled.div`
 border: 1px solid #B39A63;
 margin: 4px;
 padding:5px;
`;

const CardHeader = styled.header`
    padding:9px;
`;

/* TODO: 스크롤바 수정 필요*/
const CardContent = styled.section`
  width: 142px;
  height: 150px;
  overflow-y: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: flex;

  &::-webkit-scrollbar {
    
  }

  `;

const Info = styled.p`
  margin: 0;
  font-size: 12px;
  font-family: "Gowun Batang";
 `;

const Label = styled.span` 
  font-weight: 700;
  color: #b39a63
`;

const Value = styled.span`
  color: black;       
  font-weight: 400;
`;
// const Divider = styled.div<{ marginSize?: number }>`
//   margin: ${({ marginSize }) => `0 ${marginSize}px`};

// `;

const Divider = styled.div`
 outline: 1px #B39A63 solid;
 outline-offset: -0.50px;
 margin: 0px 8px;

`;

const CardFooter = styled.footer`
    display: flex;
    flex-direction: row;
    gap : 8px;
    justify-content: flex-end; 
    padding: 0px 8px;
    color: #000;
`; 

const Icon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #000;
`;
