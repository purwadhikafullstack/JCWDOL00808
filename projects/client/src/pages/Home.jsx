import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import CategoryCard from "../components/CategoryCard";
import Carousel1 from "../assets/carousel/carousel1.jpg";
import Carousel2 from "../assets/carousel/carousel2.jpg";
import Carousel3 from "../assets/carousel/carousel3.jpg";
import Carousel4 from "../assets/carousel/carousel4.jpg";
import Carousel from "nuka-carousel";
import { ProductCard } from "../components/ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const productsData = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/products/`
      );
      setProducts(productsData?.data?.data);
      console.log(productsData?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

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
      <div className="grid md:grid-cols-4 grid-cols-1">
        <div className="mx-2 my-4 p-2 border-2 border-black dark:bg-gray-800 dark:text-white shadow rounded-lg">
          <p>Filter</p>
          <p className="text-left">Price</p>
          <div>
            Min Price
            <div class="flex">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                Rp
              </span>
              <input
                type="text"
                class="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Min price"
              />
            </div>
          </div>
          <div>
            Max Price
            <div class="flex">
              <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                Rp
              </span>
              <input
                type="text"
                class="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Max price"
              />
            </div>
          </div>
        </div>
        <div className="my-4 px-2 grid col-span-3 md:grid-cols-4 grid-cols-2 gap-4">
          <ProductCard products={products} />
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
