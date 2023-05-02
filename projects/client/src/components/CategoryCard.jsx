import axios from "axios";
import { useEffect, useState } from "react";
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
        className="flex gap-4 overflow-x-auto py-4 px-4 mx-2" /*my-4 px-2 grid md:grid-cols-4 grid-cols-2 gap-4*/
      >
        <div
          onClick={() => props.func("")}
          className=" hover:bg-gray-300 border border-gray-200 flex flex-col min-w-fit break-words bg-white hover:shadow-xl dark:bg-slate-800 dark:shadow-dark-xl rounded-none bg-clip-border">
          <div className="flex flex-col items-center justify-between p-4">
            <p className="font-[Oswald] font-bold leading-normal uppercase text-sm dark:text-slate-300">
              All Categories
            </p>
            <p className="font-[Roboto] dark:text-white dark:opacity-60 text-sm mt-1">
              Show products on all categories
            </p>
          </div>
        </div>
        {categories.map((category, index) => {
          return (
            <div
              key={index}
              onClick={() => props.func(category.id)}
              className=" hover:bg-gray-300 border border-gray-200 flex flex-col min-w-fit break-words bg-white hover:shadow-xl dark:bg-slate-800 dark:shadow-dark-xl rounded-none bg-clip-border">
              <div className="flex flex-col items-center justify-between p-4">
                <p className="font-[Oswald] font-bold leading-normal uppercase text-sm dark:text-slate-300">
                  {category.name}
                </p>
                <p className="font-[Roboto] dark:text-white dark:opacity-60 text-sm mt-1">
                  {category.description}
                </p>
              </div>
            </div>
          );
        })}
        <Toaster />
      </div>
    </>
  );
}
