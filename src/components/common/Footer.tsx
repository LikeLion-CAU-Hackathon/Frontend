import styled from "styled-components"

export default function Footer() {
    return (
        <FooterSection>
            @ 2025 CAU likelion xmas
        </FooterSection>
    )
}

const FooterSection = styled.footer`
  color: white;
  font-size: 12px;
  font-family: SF Pro;
  font-weight: 400;
  overflow-wrap: break-word; // 자동 줄바꿈
  z-index:1;
`