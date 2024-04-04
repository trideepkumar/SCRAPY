
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import CardPlacehoderSkeleton from "../components/Placeholders/CardPlacehoderSkeleton.jsx";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "",
    sort: "created_at_desc",
    category: "",
  });

  console.log(sidebarData);

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setLoading(true);
    const { id, value, type } = e.target;

    if (
      type === "number" ||
      type === "text" ||
      type === "textarea" ||
      type === "category"
    ) {
      setSidebarData({
        ...sidebarData,
        [id]: value,
      });
    } else if (id === "type" || id === "category") {
      setSidebarData({
        ...sidebarData,
        [id]: value,
      });
    }
    fetchData();
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category/getCategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("sort", sidebarData.sort);

    if (sidebarData.categories !== "all") {
      urlParams.set("category", sidebarData.category);
    }

    const searchQuery = urlParams.toString();

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/listing/get?${searchQuery}`);
      setListing(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("type", sidebarData.type);
      urlParams.set("sort", sidebarData.sort);
      urlParams.set("category", sidebarData.category);

      if (sidebarData.category !== "all") {
        urlParams.set("category", sidebarData.category);
      }

      const res = await axiosInstance.get(`/listing/get?${urlParams}`);
      setListing(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row ">
        <div className="border border-slate-700 rounded-md p-2 m-1 lg:mt-2 border-b-2 shadow-lg sm:border-r-2 sm:w-full md:w-1/4 md:min-h-screen">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div
              className="p-3 flex flex-col  gap-2  bg rounded-md"
              style={{ background: "#363636" }}
            >
              <p className="font-bold text-gray-200 px-1">Search</p>
              <input
                type="text"
                id="searchTerm"
                placeholder="What are you looking for ?"
                className="border rounded-md border-white shadow-lg p-3 w-full "
                style={{ background: "#242424", color: "#ffffff" }}
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="p-3  rounded-md" style={{ background: "#363636" }}>
              <p className="font-bold text-gray-200 px-1">Filter</p>
              <select
                type="category"
                id="category"
                className="block appearance-none w-full border border-gray-300 hover:border-gray-400 p-3 my-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                style={{ background: "#242424", color: "#ffffff" }}
                value={sidebarData.category} 
                onChange={handleChange} 
              >
                <option value="all">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
  className="block appearance-none w-full border border-gray-300 hover:border-gray-400 p-3 my-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
  style={{ background: "#242424", color: "#ffffff" }}
  id="type"
  value={sidebarData.type} 
  onChange={handleChange}
  required
>
  <option value="">Select Type</option>
  <option value="all">All</option>
  <option value="sale">Sale</option>
  <option value="rent">Rent</option>
</select>

            </div>
            <div className="p-3 rounded-md" style={{ background: "#363636" }}>
              <select
                id="sort"
                className="block appearance-none w-full  border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                style={{ background: "#242424", color: "#ffffff" }}
                value={sidebarData.sort}
                onChange={handleChange}
              >
                <option value="created_at_desc">Recently added</option>
                <option value="regular_price_desc">Price high to low</option>
                <option value="regular_price_asc">Price low to high</option>
                <option value="createdAt_asc">Older Ads</option>
              </select>
            </div>
          </form>
        </div>

        <div className="border w-full  gap-2 my-2 py-3 rounded-lg border-slate-700  flex flex-wrap justify-center">
          {loading ? (
            Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className=" flex flex-wrap justify-between border w-100 -m-0.5 rounded-lg border-slate-700 p-7 h-80 animate-pulse "
              >
                <CardPlacehoderSkeleton />
              </div>
            ))
          ) : listing.length === 0 ? (
            <div className="text-white text-2xl overflow-auto font-bold shadow-lg p-4 border rounded-lg h-20 m-20">
              NO DATA AVAILABLE
            </div>
          ) : (
            listing.map((item, index) => (
              <div
                className="p-1 border text-white border-gray-600 h-[400px] sm:w-2/2 md:w-3/2 lg:w-5/1 flex flex-wrap  rounded-md  "
                onClick={() => navigate(`/listing/${item._id}`)}
                key={index}
              >
                <div
                  className="relative my-1 flex flex-col shadow-md   rounded-xl w-64 hover:shadow-zinc-600 "
                  style={{ background: "#242323" }}
                >
                  <div className="relative mx-2 mt-4   hover:scale-105 transition-all  o overflow-hidden bg-clip-border rounded-xl h-36 cursor-pointer hover:cursor-pointer">
                    <img
                      src={
                        item.images[0] ||
                        "https://as1.ftcdn.net/v2/jpg/02/48/42/64/1000_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                      }
                      alt="placeholder-image"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="block font-sans text-base font-bold antialiased text-white leading-relaxed ">
                        {item.name && (
                          <span className="inline-block max-w-[150px] overflow-hidden text-blue-gray-900 whitespace-nowrap">
                            {item.name}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="block font-sans text-white  text-xl  font-bold antialiased font-xl leading-relaxed ">
                      ${item.regularPrice}
                    </p>
                    <div>
                      <p className="font-sans text-xs antialiased font-fa-xs leading-relaxed text-blue-gray-900 flex items-center">
                        {item.address && (
                          <span className="flex items-center max-w-[150px] overflow-hidden text-blue-gray-900 whitespace-nowrap">
                            <FaMapMarkerAlt className="mr-1" />
                            {item.address}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                      {" "}
                      {/* {item.category && (
                        <span className="inline-block  max-w-[200px] overflow-hidden text-blue-gray-900 whitespace-nowrap">
                          {
                            categories.find(
                              (category) => category._id === item.category
                            )?.name
                          }
                        </span>
                      )} */}
                      {/* {item.type} */}
                    </p>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      className="align-middle border select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-white shadow-none  hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 "
                      type="button"
                      onClick={() => navigate(`/listing/${item._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

