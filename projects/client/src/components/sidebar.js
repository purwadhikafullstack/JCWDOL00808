import { useState } from "react";
import control from "../assets/control.png";
import Logo from "../assets/logo.png";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const Menus = [
    { title: "Dashboard", src: "Chart_fill" },
    {
      title: "Accounts",
      src: "User",
      gap: true,
      onClick: () => setShowSubMenu(!showSubMenu),
    },
    { title: "Schedule ", src: "Calendar" },
    { title: "Search", src: "Search" },
    { title: "Analytics", src: "Chart" },
    { title: "Files ", src: "Folder", gap: true },
    { title: "Setting", src: "Setting" },
  ];

  return (
    <div className="flex">
      <div className={`${open ? "w-72" : "w-20"} bg-dark-purple h-screen p-5  pt-8 relative duration-300`}>
        <img
          src={control}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img src={Logo} className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} />
          <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>Nama Website</h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"} `}
              onClick={Menu.onClick}
            >
              <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
              {/* Menampilkan submenu jika showSubMenu bernilai true */}
              {Menu.title === "Accounts" && showSubMenu && (
                <ul className="absolute bg-light-white rounded-md p-2 text-gray-300 text-sm w-40 mt-2">
                  <li className="cursor-pointer hover:bg-gray-100 p-1">Admin</li>
                  <li className="cursor-pointer hover:bg-gray-100 p-1">User</li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="h-screen flex-1 p-7">
        <h1 className="text-2xl font-semibold">Dashboard Page</h1>
      </div>
    </div>
  );
}
