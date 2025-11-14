import styled from "styled-components";
import sideFoldImage from "../../../assets/images/side_fold.png";
import bottomFoldImage from "../../../assets/images/bottom_fold.png";
import topFoldImage from "../../../assets/images/top_fold.png";
import CalendarCard from "../../../components/calendar/CalendarCard";
import type { Card } from "../../../types/card";

interface LetterEnvelopeProps {
  card: Card;
}

const LetterEnvelope = ({ card }: LetterEnvelopeProps) => {

  return (
    <LetterWrapper>
      <EnvelopeBody>
        <TopFold src={topFoldImage} alt="letter top fold" />
        <LetterBackground />
      </EnvelopeBody>
      <SideFold src={sideFoldImage} alt="letter side fold" />
      <BottomFold src={bottomFoldImage} alt="letter bottom fold" />
      <StampSection>
        <CalendarCard card={card} onClick={() => {}} />
      </StampSection>
    </LetterWrapper>
  );
};

export default LetterEnvelope;

const LetterWrapper = styled.main`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -10.4px; // 중앙 정렬이 안되는 이유?
`;

const EnvelopeBody = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const TopFold = styled.img`
  display: block; 
  z-index:0;
  margin-bottom: -25px;
  z-index: 1;
  width: 100%;
`;

const LetterBackground = styled.div`
  width: 100%;
  height: 255px;
  background: #781313;
  border-radius: 4.16px;
  border: 0.39px #781313 solid;
  z-index: 0;
`;

const SideFold = styled.img`
  position: absolute;
  z-index: 3;
  bottom: 0;
  display: block;
  height: 230px;
  width: 100%;
`;

const BottomFold = styled.img`
  position: absolute;
  z-index: 4;
  bottom: 0;
  display: block;
`;

const StampSection = styled.section`
  position: absolute;
  z-index: 5;
  bottom: 10px;
  right: 23px;
  `;