import axios from "axios";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function CategoryCard(props) {
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
      <div
        onClick={() => props.func("")}
        className="hover:animate-pulse flex flex-col min-w-fit break-words bg-white shadow-xl dark:bg-slate-800 dark:shadow-dark-xl rounded-2xl bg-clip-border"
      >
        <div className="flex flex-col items-center justify-between p-4">
          <p className="font-sans font-bold leading-normal uppercase text-sm dark:text-slate-300">
            All Categories
          </p>
          <p className=" dark:text-white dark:opacity-60 text-sm">
            Show products on all categories
          </p>
        </div>
      </div>
      {categories.map((category, index) => {
        return (
          <div
            key={index}
            onClick={() => props.func(category.id)}
            className="hover:animate-pulse flex flex-col min-w-fit break-words bg-white shadow-xl dark:bg-slate-800 dark:shadow-dark-xl rounded-2xl bg-clip-border"
          >
            <div className="flex flex-col items-center justify-between p-4">
              <p className="font-sans font-bold leading-normal uppercase text-sm dark:text-slate-300">
                {category.name}
              </p>
              <p className=" dark:text-white dark:opacity-60 text-sm">
                {category.description}
              </p>
            </div>
          </div>
        );
      })}
      <Toaster />
    </>
  );
}
