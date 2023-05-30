import React, { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  ChartPieIcon,
  LinkIcon,
  MagnifyingGlassCircleIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

export function Navbar(props) {
  const user = props.user;
  const [showMenu, setShowMenu] = useState(0);

  const navbarRoutes = [
    {
      title: "dashboard",
      path: "/admin",
      icon: ChartPieIcon,
    },
    {
      title: "users",
      path: "/admin/users",
      icon: UsersIcon,
      adminOnly: true,
    },
    {
      title: "check link",
      path: `/${user?.username}`,
      icon: LinkIcon,
      isBlank: true,
    },
    {
      title: "sign out",
      path: "/api/auth/logout",
      icon: ArrowRightOnRectangleIcon,
    },
  ];
  const brand = {
    name: "Misterpoint Social Links",
    url_logo: "/assets/common/images/logo-favicon-web.png",
  };
  return (
    <div className="fixed flex w-full z-20 justify-center backdrop-blur-lg">
      {showMenu ? (
        <div className="absolute w-full max-w-7xl mt-20 z-20">
          <div className="fixed inset-0 z-0 h-screen w-full bg-black/50 backdrop-blur-lg" />
          <div className="flex bg-white bg-opacity-70 backdrop-blur-3xl rounded-3xl mx-2 mt-5 p-3">
            <div className="flex-row w-full ">
              {navbarRoutes
                .filter((res) =>
                  user.role_id !== 1 ? res.adminOnly !== true : res
                )
                .map(({ title, path, icon, isBlank }) => (
                  <a key={title} href={path} target={isBlank ? "_blank" : ""}>
                    <div className="flex justify-start  items-center hover:text-light-blue-800 capitalize w-full p-2 my-1 hover:bg-white hover:bg-opacity-50 rounded-full">
                      {icon &&
                        React.createElement(icon, {
                          className: "w-[18px] h-[18px] opacity-50 mr-1",
                        })}
                      <span>{title}</span>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      ) : null}
      <div
        className={`flex bg-white mt-4 w-full  mx-2 max-w-7xl rounded-full
         shadow-lg bg-opacity-70 backdrop-blur-lg ${showMenu ? "z-20" : ""}`}
      >
        {/* content wrapper */}
        <div className="flex-row w-full justify-center items-center">
          <div className="flex w-full justify-between items-center px-5 lg:px-10 h-16">
            <div
              id="title"
              className="flex text-gray-800 text-sm space-x-3 items-center"
            >
              <img src={brand?.url_logo} className="h-10 w-10" />
              <div className="flex flex-col">
                <h1 className="font-semibold">MRLink</h1>
                <span className="text-xs">{brand?.name}</span>
              </div>
            </div>
            {props.isLoggedIn && (
              <>
                <div
                  id="navigation"
                  className="hidden md:flex justify-center items-center space-x-6 text-gray-900 text-sm font-thin"
                >
                  {navbarRoutes
                    .filter((res) =>
                      user.role_id !== 1 ? res.adminOnly !== true : res
                    )
                    .map(({ title, path, icon, isBlank }) => (
                      <a
                        key={title}
                        href={path}
                        target={isBlank ? "_blank" : ""}
                        className="flex justify-center items-center hover:text-light-blue-800 capitalize"
                      >
                        {icon &&
                          React.createElement(icon, {
                            className: "w-[18px] h-[18px] opacity-50 mr-1",
                          })}
                        <span>{title}</span>
                      </a>
                    ))}
                </div>
                <div id="button">
                  <button
                    onClick={() =>
                      showMenu ? setShowMenu(false) : setShowMenu(true)
                    }
                    className="flex md:hidden space-x-2 text-sm text-gray-300 bg-gray-900 py-2 px-4 rounded-full hover:opacity-70"
                  >
                    {user.img ? (
                      <img
                        src={user.img}
                        className="w-[18px] h-[18px] mr-1 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-[18px] h-[18px] opacity-50 mr-1" />
                    )}
                    <span>{user?.username}</span>
                  </button>
                  <button className="hidden md:flex space-x-2 text-sm text-gray-300 bg-gray-900 py-2 px-4 rounded-full hover:opacity-70">
                    {user.img ? (
                      <img
                        src={user.img}
                        className="w-[18px] h-[18px] mr-1 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-[18px] h-[18px] opacity-50 mr-1" />
                    )}
                    <span>{user?.username}</span>
                  </button>
                </div>
              </>
            )}

            {!props.isLoggedIn && (
              <div id="button">
                <a
                  href="/auth/signup"
                  className="flex text-sm text-gray-300 bg-gray-900 py-2 px-4 rounded-full hover:opacity-70"
                >
                  <span>Sign Up</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
