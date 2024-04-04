import React, { useEffect, useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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
      className="shadow-md sticky top-0 bg-gray-900 z-10 "
      style={{ backgroundColor: "#363636"}}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-cursive font-bold text-sm sm:text-xl lg:text-2xl flex flex-wrap p-1 rounded-md  cursor-pointer lg:border-white">
            <span className="text-slate-200 hover:scale-125 duration-300 ">
              Scrapy
            </span>
          </h1>
        </Link>

        <div className="hidden sm:block">
          <form
            onSubmit={handleSubmit}
            className="p-3 rounded-lg flex items-center"
            style={{ background: "#242424" }}
          >
            <input
              placeholder="search here..."
              className="bg-transparent text-white font-sans focus:outline-none w-24 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-slate-200" />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <FaBars
              className="text-white text-2xl cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
          </div>
          {showMenu && (
            <div className="sm:hidden absolute top-16 right-0  w-48 p-2 rounded-md shadow-md" style={{background:'#363636'}}>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-white">
                  Home
                </Link>
                <Link to="/about" className="text-white">
                  About
                </Link>
                <Link to="/profile" className="text-white">
                  {currentUser
                    ? `Hi ${currentUser.user.username} !`
                    : "Sign In"}
                </Link>
              </div>
            </div>
          )}
          <div className="hidden sm:flex gap-4 text-sm font-bold">
            <Link
              to="/"
              className=" hidden sm:inline group font-bold text-white transition duration-300 relative"
            >
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white absolute bottom-0 left-0 right-0"></span>
              Home
            </Link>
            <Link
              to="/about"
              className=" hidden sm:inline group font-bold text-white transition duration-300 relative"
            >
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white absolute bottom-0 left-0 right-0"></span>
              About
            </Link>
            <Link
              to="/profile"
              className=" hidden sm:inline group font-bold text-white transition duration-300 relative"
            >
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white absolute bottom-0 left-0 right-0"></span>

              {currentUser ? `Hi ${currentUser.user.username} !` : "Sign In"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
