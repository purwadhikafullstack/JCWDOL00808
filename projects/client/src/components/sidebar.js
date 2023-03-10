import { useState } from "react";
import { BsArrowLeftShort, BsSearch, BsChevronDown, BsReverseLayoutTextSidebarReverse, BsBuilding } from "react-icons/bs";
import { AiFillEnvironment, AiOutlineFileText, AiOutlineBarChart, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import React from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(-1);

  const Menus = [
    { title: "Dashboard" },
    { title: "Product", icon: <AiOutlineFileText />, submenu: true, submenuItems: [{ title: "Manage Product" }, { title: "Manage Category Product" }] },
    {
      title: "Account",
      icon: <BsReverseLayoutTextSidebarReverse />,
      submenu: true,
      submenuItems: [{ title: "Admin Account" }, { title: "List User" }],
    },
    { title: "Analytics", icon: <AiOutlineBarChart /> },
    { title: "Warehouse", spacing: true, icon: <BsBuilding /> },
    { title: "Setting", icon: <AiOutlineSetting /> },
    { title: "Logout", icon: <AiOutlineLogout /> },
  ];

  return (
    <div className="flex">
      <div className={`bg-dark-purple h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} duration-300 relative`}>
        <BsArrowLeftShort
          className={`bg-white text-dark-purple text-3xl rounded-full 
        absolute -right-3 top-9 border border-dark-purple cursor-pointer ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

        <div className="inline-flex">
          <AiFillEnvironment className={`bg-amber-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${open && "rotate-[360deg]"}`} />
          <h1 className={`text-white origin-left font-medium text-2xl duration-300 ${!open && "scale-0"}`}>Big4Commerce</h1>
        </div>

        <div className={`flex items-center rounded-md bg-light-white mt-6 ${!open ? "px-2.5" : "px-4"} py-2 `}>
          <BsSearch className={`text-white text-lg block float-left cursor-pointer ${open && "mr-2"}`} />
          <input type="search" placeholder="search" className={`text-base bg-transparent w-full text-white focus:outline-none ${!open && "hidden"}`} />
        </div>

        <ul className="pt-2">
          {Menus.map((menu, index) => (
            <>
              <li
                key={index}
                className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2
            hover:bg-light-white rounded-md ${menu.spacing ? "mt-9" : "mt-2"} `}
              >
                <span className="text-2xl block float-left">{menu.icon ? menu.icon : <RiDashboardFill />}</span>
                <span className={`text-base font-medium duration-200 ${!open && "hidden"}`}>{menu.title}</span>
                {menu.submenu && open && <BsChevronDown className={`${openSubMenuIndex === index && "rotate-180"} ml-24`} onClick={() => setOpenSubMenuIndex(openSubMenuIndex === index ? -1 : index)} />}
              </li>

              {menu.submenu && openSubMenuIndex === index &&  open && (
                <ul>
                  {menu.submenuItems.map((submenuItem, submenuIndex) => {
                    return (
                      <li
                        key={submenuIndex}
                        className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer
                    p-2 px-5 hover:bg-light-white rounded-md"
                      >
                        {submenuItem.title}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ))}
        </ul>
      </div>
      <div className="p-7">
        <h1 className="text-2xl font-semibold"> Dashboard Page</h1>
      </div>
    </div>
  );
}
