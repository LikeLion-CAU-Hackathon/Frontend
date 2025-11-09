import styled from 'styled-components'
import coverImage from '../assets/images/cover.png'
import CardGrid from '../components/calendar/CardGrid'
import Footer from '../components/common/Footer'

const CalendarPage = () => {

  return (
    <PageContainer $coverImage={coverImage}>
      <ContentWrapper>
        <CardGrid />
      </ContentWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  )
}

export default CalendarPage

const PageContainer = styled.div<{ $coverImage: string }>`
  padding: 76px;                     
  background-image: url(${props => props.$coverImage});
  background-position: center;
  background-size: auto;
  display: flex;
  flex-direction: column;
  align-items: center;            
  justify-content: center;     
  gap: 25px;    
`

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`
