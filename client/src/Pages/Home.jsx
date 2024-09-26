import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion, useAnimation } from "framer-motion";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import CardPlacehoderSkeleton from "../components/Placeholders/CardPlacehoderSkeleton";

// Header component
const HeaderHome = () => (
  <div className="relative bg-gradient-to-r from-green-50 to-teal-200 p-10 rounded-lg shadow-lg h-[90vh]">
    <div className="flex justify-between items-center h-full">
      <div className="w-1/2">
        <h1 className="text-4xl font-bold text-gray-900">
          Search your<span className="text-orange-600">own needs</span> here at Scrapy....
        </h1>
        <p className="text-gray-700 mt-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text.
        </p>
        <div className="mt-6 flex">
          <input
            type="text"
            placeholder="I am looking for..."
            className="p-3 w-2/5 border border-gray-300 rounded-l-lg"
          />
          <select className="p-3 w-1.5/5 border border-gray-300">
            <option>Search Location</option>
          </select>
          <button className="bg-orange-600 text-white p-3 rounded-r-lg">
            Search Ads
          </button>
        </div>
        {/* Summary */}
        <div className="flex mt-8 space-x-8">
          <div className="text-center">
            <span className="text-2xl text-orange-600">35</span>
            <p className="text-gray-600">Active Seller</p>
          </div>
          <div className="text-center">
            <span className="text-2xl text-green-600">60</span>
            <p className="text-gray-600">Total Customer</p>
          </div>
        </div>
      </div>
      {/* Image Section */}
      <div className="w-1/2 flex justify-end">
        <img
          src='src/assets/scrapy_dash_2.png'
          alt="Laptop with Ad"
          className="w-4/5 rounded-lg"
        />
      </div>
    </div>
  </div>
);


// Category component
const CategoryHome = ({ category, loading }) => (
  <Link to="/search">
    <div className="flex justify-center drop-shadow-2xl rounded-lg sm:p-0 sm:m-0 xs:p-0 xs:m-0 lg:m-10 lg:p-10 md:m-10 md:p-10">
      <div className="flex flex-wrap justify-center">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <CardPlacehoderSkeleton key={index} />
            ))
          : category.map((item) => (
              <Card
                key={item.id}
                className="max-w-[125px] m-3 hover:scale-105 shadow-lg duration-1000"
                style={{ background: "#363636" }}
              >
                <CardHeader floated={false} className="h-12 w-12 mx-10 mb-0 items-center">
                  <img src={item.icon} alt="category-icon" className="object-contain" />
                </CardHeader>
                <CardBody className="text-center">
                  <Typography
                    variant="h4"
                    color="blue-gray"
                    className="mb-2 text-white text-sm font-bold"
                  >
                    {item.name}
                  </Typography>
                </CardBody>
              </Card>
            ))}
      </div>
    </div>
  </Link>
);

// Listing component
const ListingHome = ({ listing, loading, controls }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between shadow-2xl p-5 m-5 rounded-lg overflow-x-auto flex-wrap sm:flex-nowrap">
      {loading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="border w-80 m-2 rounded-lg border-slate-700 p-7 h-80 animate-pulse"
          >
            <CardPlacehoderSkeleton />
          </div>
        ))
      ) : listing.length === 0 ? (
        <div className="flex justify-center items-center text-white text-2xl font-bold shadow-lg p-4 border rounded-lg">
          NO DATA AVAILABLE
        </div>
      ) : (
        <motion.div
          className="flex hover:scroll"
          animate={{
            x: ["0%", "-100%"],
            transition: {
              ease: "linear",
              duration: 20,
              repeat: Infinity,
            },
          }}
          onMouseEnter={() => controls.stop()}
          onMouseLeave={() => controls.start()}
        >
          {listing.map((item, index) => (
            <div
              className="p-1 border m-2 text-white border-gray-600 h-[390px] rounded-md"
              onClick={() => navigate(`/listing/${item._id}`)}
              key={index}
            >
              <div
                className="relative my-1 flex flex-col shadow-md bg-clip-border rounded-xl w-64"
                style={{ background: "#242323" }}
              >
                <div className="relative mx-10 mt-4 hover:scale-105 transition-all bg-clip-border rounded-xl h-28 cursor-pointer">
                  <img
                    src={
                      item.images[0] ||
                      "https://as1.ftcdn.net/v2/jpg/02/48/42/64/1000_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                    }
                    alt="listing-image"
                    className="object-fill w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <p className="block font-sans text-white text-xl font-bold leading-relaxed">
                    ${item.regularPrice}
                  </p>
                  <p className="font-sans text-xs flex items-center text-blue-gray-900">
                    <FaMapMarkerAlt className="mr-1" />
                    {item.address}
                  </p>
                  <p className="block font-sans text-sm font-normal leading-normal text-gray-700 opacity-75">
                    {item.description}
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <button
                    className="align-middle border text-xs py-3 px-6 rounded-lg bg-blue-gray-900 text-white hover:scale-105"
                    type="button"
                    onClick={() => navigate(`/listing/${item._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Main Home component
const Home = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get("/category/getCategory");
        if (res.status === 200) {
          setCategory(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchListing = async () => {
      try {
        const res = await axiosInstance.get("/listing/get");
        setListing(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategory();
    fetchListing();
  }, []);

  return (
    <>
      <HeaderHome />
      <CategoryHome category={category} loading={loading} />
      <div className="text-center p-5 text-3xl font-bold rounded-xl m-7 items-center animate-bounce">
        <p className="text-white m-5">
          Get the Latest Collections from here ...
        </p>
      </div>
      <ListingHome listing={listing} loading={loading} controls={controls} />
    </>
  );
};

export default Home;
