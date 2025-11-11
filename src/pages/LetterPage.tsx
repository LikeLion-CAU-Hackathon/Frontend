// card.ts 상태 isOpened=true일 때
import styled from "styled-components";
import sideFoldImage from "../assets/images/side_fold.png";
import bottomFoldImage from "../assets/images/bottom_fold.png";
import topFoldImage from "../assets/images/top_fold.png";

const LetterPage = () => {
  return (
    <LetterWrapper>
        <LetterSection>
            <TopFold src={topFoldImage} alt="letter top fold" />
            <LetterBackground />
        </LetterSection>
        <SideFold src={sideFoldImage} alt="letter side fold" />
        <BottomFold src={bottomFoldImage} alt="letter bottom fold" />
    </LetterWrapper>
  )
}

export default LetterPage

const LetterWrapper = styled.main`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 20;
`
const LetterSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`
const TopFold = styled.img`
  z-index: 4;
  display: block;
  margin-bottom: -23px; // 간격이 생기는 이유 모르겠어서 일단 이렇게 해결
`;

const LetterBackground = styled.div`
  width: 100%;
  height: 249px;
  background: #781313;
  border-radius: 4.16px;
  border: 0.39px #781313 solid;
  bottom: 0;
  position: relative;
  z-index: 1;
`;

const SideFold = styled.img`
  position: absolute;
  z-index: 2;
  bottom: 0;
  display: block;
`;

const BottomFold = styled.img`
  position: absolute;
  z-index: 3;
  bottom: 0;
  display: block;
`;