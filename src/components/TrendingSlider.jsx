// src/components/TrendingSlider.jsx
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function TrendingSlider() {
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Slider {...settings}>
      {[1,2,3,4,5].map(i => (
        <div key={i}>
          <a href="/buy" className="coin_box">
            <div className="d-flex mb-2">
              <div className="coin_box_left">
                <img src="/img/about.png" alt="token" />
              </div>
              <div>
                <h3>Occy Token (OCCY)</h3>
                <div className="color1">market cap: $2.3M</div>
                <div className="op_05">replies: 314</div>
              </div>
            </div>
            <p>New South Park Episode Takes Aim at Memecoins</p>
          </a>
        </div>
      ))}
    </Slider>
  );
}
