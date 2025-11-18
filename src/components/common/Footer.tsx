import { useEffect, useState } from "react"
import styled from "styled-components"

export default function Footer() {
    // Footer 위로 올라오는 문제 해결: 특정 높이 이하면 숨기기
    const [ show, setShow] = useState(true);

    useEffect(() => {
        const resize = () => {
            setShow(window.innerHeight > 750);
        };

        resize();
        window.addEventListener("resize", resize);
        return() => window.removeEventListener("resize", resize);
    }, []);

    if (!show) return null;

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
  z-index: 1;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
`
