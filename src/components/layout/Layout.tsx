import styled from 'styled-components'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
      <AppWrapper>
        <AppContainer>
        {children}
        </AppContainer>
      </AppWrapper>
    )
}

export default Layout;

const AppWrapper = styled.div`

`

const AppContainer = styled.div`

`