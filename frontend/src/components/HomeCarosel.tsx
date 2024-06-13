import { Carousel } from "primereact/carousel";
import { useState } from "react";
import CarouselImg1 from "../assets/images/carousel/carousel_1.jpg";
import CarouselImg2 from "../assets/images/carousel/carousel_2.jpg";
import CarouselImg3 from "../assets/images/carousel/carousel_3.jpg";
import CarouselImg4 from "../assets/images/carousel/carousel_4.jpg";
import { Navigate } from "react-router-dom";

const responsiveOptions = [
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
];

type TemplateType = {
  img: string;
};

const productTemplate = ({ img }: TemplateType) => {
  return (
    <img src={img} alt={"img"} className="shadow-2" style={{ width: "100%" }} />
  );
};

const HomeCarosel = () => {
  const [product] = useState([
    {
      img: CarouselImg1,
      url: "/carousel/1",
    },
    {
      img: CarouselImg2,
      url: "/carousel/2",
    },
    {
      img: CarouselImg3,
      url: "/carousel/3",
    },
    {
      img: CarouselImg4,
      url: "/carousel/4",
    },
    // CarouselImg1,
    // CarouselImg2,
    // CarouselImg3,
    // CarouselImg4,
  ]);
  return (
    <div className="card">
      <Carousel
        value={product}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        circular
        // autoplayInterval={3000}
        onClick={() => <Navigate to={"/carousel"} />}
      />
    </div>
  );
};

export default HomeCarosel;
