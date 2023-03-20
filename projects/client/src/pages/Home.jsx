import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import CategoryCard from "../components/CategoryCard";
import Carousel1 from "../assets/carousel/carousel1.jpg";
import Carousel2 from "../assets/carousel/carousel2.jpg";
import Carousel3 from "../assets/carousel/carousel3.jpg";
import Carousel4 from "../assets/carousel/carousel4.jpg";
import Carousel from "nuka-carousel";

export default function Home() {
  return (
    <div className="container flex flex-col justify-between">
      <Navbar />
      <div className="p-2 md:p-4" /*mt-16 */>
        <Carousel
          wrapAround={true}
          autoplay={true}
          pauseOnHover={true}
          defaultControlsConfig={{
            nextButtonText: ">",
            prevButtonText: "<",
            pagingDotsStyle: {
              fill: "white",
              margin: "0 15px 0 15px",
            },
          }}
        >
          <img src={Carousel1} alt="carousel-1" className="w-full rounded-lg" />
          <img src={Carousel2} alt="carousel-2" className="w-full rounded-lg" />
          <img src={Carousel3} alt="carousel-3" className="w-full rounded-lg" />
          <img src={Carousel4} alt="carousel-4" className="w-full rounded-lg" />
        </Carousel>
      </div>
      <div className="my-4 px-2 grid md:grid-cols-4 grid-cols-2 gap-4">
        <CategoryCard />
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
