/* 답변 포스트잇 컴포넌트 */

import { AiOutlineComment, AiOutlineHeart } from "react-icons/ai";
import styled from "styled-components";

interface AnswerListProps {
    author: string;
    date: string;
    time: string;
    content: string;
    likes: number;
    comments : number;
}

const AnswerCard = ({ author, date, time, content, likes, comments } : AnswerListProps) => {
    return (
        <AnswerContainer>
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
                    {content}
                </CardContent>
                <CardFooter>
                    <Icon>
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

const AnswerContainer = styled.article`
  background: #DECBA1;
  font-family: Gowun Batang;
  font-weight: 400;
  word-wrap: break-word;
  font-size: 12px;
`;

const AnswerWrapper = styled.div`
 border: 1px solid #B39A63;
 margin: 4px;
 padding:5px;
`;

const CardHeader = styled.header`
    padding:12px;
`;

const CardContent = styled.section`
  width: 142px;
  height: 150px;
  overflow-y: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;

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