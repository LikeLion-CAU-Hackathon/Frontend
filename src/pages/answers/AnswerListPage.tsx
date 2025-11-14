import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnswerSlide from "./components/AnswerSlide";
import styled from "styled-components";

const AnswerListPage = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }

    const slides = [
      { id:1, },
      { id:2, },
  ];

  return (
    <PageWrapper>
      <Slider {...settings}>
        {slides.map((slide) => (
          <AnswerSlide key={slide.id} backgroundImg="" />
        ))}
      </Slider>
    </PageWrapper>

  )
}

export default AnswerListPage

const PageWrapper = styled.main`
`;