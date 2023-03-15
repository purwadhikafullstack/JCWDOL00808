import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import CarouselComponent from "../components/CarouselComponent";

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col justify-between">
      <Navbar />
      <ScrollToTopButton />
      <div className="mt-24 mb-4">
        <CarouselComponent />
      </div>
      <Footer />
    </div>
  );
}
