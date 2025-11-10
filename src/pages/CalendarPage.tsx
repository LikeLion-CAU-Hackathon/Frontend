import styled from 'styled-components'
import CardGrid from '../components/calendar/CardGrid'
import Footer from '../components/common/Footer'

const CalendarPage = () => {

  return (
    <PageContainer>
      <MainContent>
        <CardGrid />
      </MainContent>
      <FooterSection>
        <Footer />
      </FooterSection>
    </PageContainer>
  )
}

export default CalendarPage

const PageContainer = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;            
  justify-content: center;     
  gap: 25px;    
`

const MainContent = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
`

const FooterSection = styled.footer`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`
