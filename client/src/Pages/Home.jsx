
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion, useAnimation } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import CardPlacehoderSkeleton from "../components/Placeholders/CardPlacehoderSkeleton";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState([]);
  const controls = useAnimation();
  console.log(category);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/listing/get`);
      setListing(res.data);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosInstance.get("/category/getCategory");
        if (res.status === 200) {
          setCategory(res.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    fetchData();
  }, []);

  return (
    <div className="mb-0">
      <div className="text-center p-5 text-3xl font-extrabold rounded-xl  m-7 items-center shadow-2xl animate-pulse">
        <p className="text-white m-5 ">
          Search, Sell & Buy India best classifieds for you ...
        </p>
      </div>

  <Link to={"/search"}>
  <div className="flex justify-center drop-shadow-2xl rounded-lg sm:p-0 sm:m-0 xs:p-0 xs:m-0 lg:m-10 lg:p-10 md:m-10 md:p-10">
    <div className="flex flex-wrap justify-center">
      {category.map((item, index) => (
        <Card
          key={item.id}
          className="max-w-[125px] m-3 hover:scale-105 shadow-lg duration-1000"
          style={{ background: "#363636" }}
        >
          <CardHeader
            floated={false}
            className="h-12 w-12 mx-10 mb-0 items-center"
          >
            <img src={item.icon} alt="profile-picture" className="object-contain" />
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


      <div className="text-center p-5 text-3xl font-bold rounded-xl  m-7 items-center  animate-bounce">
        <p className="text-white m-5 ">
          Get the Latest Collections from here ...{" "}
        </p>
      </div>

      <div
        className="flex justify-between shadow-2xl p-5 m-5 rounded-lg overflow-x-auto flex-wrap sm:flex-nowrap  "
      >
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
          <div className="flex justify-center mx-[540px] sm:[100px] items-center text-white text-2xl overflow-auto font-bold shadow-lg p-4 border rounded-lg">
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
                  className="relative my-1 flex flex-col shadow-md bg-clip-border rounded-xl w-64 card"
                  style={{ background: "#242323" }}
                >
                  <div className="relative mx-10 mt-4  hover:scale-105 transition-all overflow-hidden bg-clip-border rounded-xl h-28 cursor-pointer hover:cursor-pointer">
                    <img
                      src={
                        item.images[0] ||
                        "https://as1.ftcdn.net/v2/jpg/02/48/42/64/1000_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
                      }
                      alt="placeholder-image"
                      className="object-fill w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                        {item.name && (
                          <span className="inline-block max-w-[150px] overflow-hidden text-blue-gray-900 whitespace-nowrap">
                            {item.name}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="block font-sans text-white text-xl font-bold antialiased font-xl leading-relaxed ">
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
                      {item.description && (
                        <span className="inline-block max-w-[200px] overflow-hidden text-blue-gray-900 whitespace-nowrap">
                          {item.description}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      className="align-middle border select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-white shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
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

    </div>
  );
}


