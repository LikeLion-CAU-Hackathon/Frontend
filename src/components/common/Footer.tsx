import styled from "styled-components"

export default function Footer() {
    return (
        <FooterSection>
            @ 2025 CAU likelion xmas
        </FooterSection>
    )
}

const FooterSection = styled.footer`
  position: absolute;
  color: white;
  font-size: 12px;
  font-family: SF Pro;
  font-weight: 400;
  z-index:1;
  bottom:37px;
`