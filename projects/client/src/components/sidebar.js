import { useState } from "react";
import { BsArrowLeftShort, BsSearch, BsChevronDown, BsReverseLayoutTextSidebarReverse, BsBuilding } from "react-icons/bs";
import { AiFillEnvironment, AiOutlineFileText, AiOutlineBarChart, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutDialog from "./logoutAdminDialog";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(-1);
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();

    // Redirect to login page after logout
    navigate("/admin/login");
  };

  const Menus = [
    { title: "Dashboard", onClick: () => navigate("/admin/dashboard") },
    {
      title: "Product",
      icon: <AiOutlineFileText />,
      submenu: true,
      submenuItems: [{ title: "Manage Product" }, { title: "Manage Category Product" }],
    },
    {
      title: "Account",
      icon: <BsReverseLayoutTextSidebarReverse />,
      submenu: true,
      submenuItems: [{ title: "Admin Account" }, { title: "List User" }],
    },
    {
      title: "Warehouse",
      icon: <BsBuilding />,
      submenu: true,
      submenuItems: [{ title: "Stock Mutations" }],
    },
    { title: "Analytics", spacing: true, icon: <AiOutlineBarChart /> },
    { title: "Setting", icon: <AiOutlineSetting /> },
    { title: "Logout", icon: <AiOutlineLogout />, onClick: handleOpen },
  ];

  return (
    <div className="flex" style={{ position: "sticky", top: 0, height: "100vh" }}>
      <div className={`bg-dark-purple h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} duration-300 relative`}>
        <BsArrowLeftShort
          className={`bg-white text-dark-purple text-3xl rounded-full 
        absolute -right-3 top-9 border border-dark-purple cursor-pointer ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

        <div className="inline-flex">
          <AiFillEnvironment className={`bg-amber-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${open && "rotate-[360deg]"}`} />
          <h1 className={`text-white p-2 font-medium text-2xl duration-300 ${!open && "scale-0"}`}>Big4Commerce</h1>
        </div>

        {/* <div className={`flex items-center rounded-md bg-light-white mt-6 ${!open ? "px-2.5" : "px-4"} py-2 `}>
          <BsSearch className={`text-white text-lg block float-left cursor-pointer ${open && "mr-2"}`} />
          <input type="search" placeholder="search" className={`text-base bg-transparent w-full text-white focus:outline-none ${!open && "hidden"}`} />
        </div> */}

        <ul className="pt-2">
          {Menus.map((menu, index) => (
            <>
              {menu.title === "Account" && role === "2" ? null : ( // role nomor 2 menandakan sebagai admin warehouse
                <li
                  key={index}
                  className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2
      hover:bg-light-white rounded-md ${menu.spacing ? "mt-9" : "mt-2"} `}
                  onClick={menu.onClick}
                  // onClick={handleOpen}
                >
                  <span className="text-2xl block float-left">{menu.icon ? menu.icon : <RiDashboardFill />}</span>
                  <span className={`text-base font-medium duration-200 ${!open && "hidden"}`}>{menu.title}</span>
                  {menu.submenu && open && <BsChevronDown className={`${openSubMenuIndex === index && "rotate-180"} `} onClick={() => setOpenSubMenuIndex(openSubMenuIndex === index ? -1 : index)} />}
                  {menu.title === "Logout" && <LogoutDialog onLogout={handleLogout} isOpen={isOpen} onClose={handleClose} />}
                </li>
              )}

              {menu.submenu && openSubMenuIndex === index && open && (
                <ul>
                  {menu.submenuItems.map((submenuItem, submenuIndex) => {
                    return (
                      <li
                        key={submenuIndex}
                        className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer
          p-2 px-5 hover:bg-light-white rounded-md"
                        onClick={() => {
                          if (submenuItem.title === "Admin Account") {
                            navigate("/admin/manageadmin");
                          } else if (submenuItem.title === "List User") {
                            navigate("/admin/adminuserlist");
                          } else if (submenuItem.title === "Manage Category Product") {
                            navigate("/admin/managecategory");
                          } else if (submenuItem.title === "Manage Product") {
                            navigate("/admin/manageProducts");
                          } else if (submenuItem.title === "Stock Mutations") {
                            navigate(role === "1" ? "/warehouse/getAllstockmutationrequest" : "/warehouse/getstockmutationrequest");
                          }
                        }}
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
    </div>
  );
}
