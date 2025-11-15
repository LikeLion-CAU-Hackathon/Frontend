/* 답변 포스트잇 컴포넌트 */
import { AiOutlineComment, AiOutlineHeart } from "react-icons/ai";
import styled from "styled-components";
import { useLike } from "../../hooks/useLike";

interface AnswerListProps {
    id: number;
    author: string;
    date: string;
    time: string;
    contents: string;
    likes: number;
    comments : number;
    width?: string;
    height?: string;
}

const AnswerCard = ({ id, author, date, time, contents, likes, comments, width, height } : AnswerListProps) => {
    const { liked, likeCount, handleLike } = useLike(false, likes, id);

    return (
        <AnswerContainer $width={width} $height={height}>
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
                    <Icon onClick={handleLike} >
                        <AiOutlineHeart />
                        {likes} 
                    </Icon>
                    <Icon>
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
  height: ${({ $height }) => $height || "248px"};
`;

const AnswerWrapper = styled.div`
 border: 1px solid #B39A63;
 margin: 4px;
 padding:5px;
`;

const CardHeader = styled.header`
    padding:12px;
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
`; 

const Icon = styled.div`
`;