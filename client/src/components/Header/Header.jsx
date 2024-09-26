import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
      name: currentUser ? `Hi ${currentUser.user.username} !` : "Sign In",
      path: currentUser ? "/profile" : "/login",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header
      className="shadow-md sticky top-0 z-10 bg-gradient-to-r from-green-50 to-teal-200"
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-cursive font-bold text-sm sm:text-xl lg:text-2xl flex flex-wrap p-1 rounded-md cursor-pointer lg:border-white">
            <span className="text-gray-800 hover:scale-125 duration-300">
              Scrapy
            </span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <FaBars
              className="text-gray-800 text-2xl cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
          </div>
          {showMenu && (
            <div
              className="sm:hidden absolute top-16 right-0 w-48 p-2 rounded-md shadow-md"
              style={{ background: "#363636" }}
            >
              <div className="flex flex-col gap-2">
                {menuLinks.map((link, index) => (
                  <Link key={index} to={link.path} className="text-white">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="hidden sm:flex gap-4 text-sm font-bold">
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="group font-bold text-gray-800 transition duration-300 relative"
              >
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-800 absolute bottom-0 left-0 right-0"></span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
