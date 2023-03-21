import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function CategoryCard() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/products/category`
      );
      setCategories(categoriesData?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {categories.map((category, index) => {
        return (
          <div
            key={index}
            className="relative hover:animate-pulse flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-800 dark:shadow-dark-xl rounded-2xl bg-clip-border"
          >
            <div className="flex-auto p-4">
              <div className="flex flex-row justify-center -mx-3">
                <Link to="#">
                  <div className="flex flex-col justify-between px-1">
                    <p className="font-sans font-bold leading-normal uppercase text-sm dark:text-slate-300">
                      {category.name}
                    </p>
                    <p className=" dark:text-white dark:opacity-60 text-sm">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <Toaster />
    </>
  );
}
