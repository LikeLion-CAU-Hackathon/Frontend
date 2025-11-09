import styled from "styled-components"

export default function Footer() {
    return (
        <FooterSection>
            @ 2025 CAU likelion xmas
        </FooterSection>
    )
}

const FooterSection = styled.footer`
    width: 148px;
    height: 14px;
    position: relative;
    font-size: 12px;
    font-family: 'SF Pro';
    color: #fff;
    text-align: center;
    display: inline-block;
`