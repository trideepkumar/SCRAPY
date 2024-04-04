import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.jsx";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { ShareSocial } from "react-share-social";
import { FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact/Contact.jsx";
import Spinner from "../components/Placeholders/Spinner.jsx";

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);

  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [share, setShare] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [contact,setContact] = useState(false)

  console.log(listing);

  const fetchListing = async () => {
    try {
      const res = await axiosInstance.get(`/listing/getList/${params.id}`);
      const data = await res.data;
      console.log(data);
      if (res.status === 200) {
        setListing(data);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError(true);
      setLoading(false);
    }
  };

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      console.log("URL copied to clipboard:", url);
      setShare(url);
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
    }
  };

  const handleChatClick = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
     <Spinner/>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 text-center ">
        Error occurred while fetching data!!
      </p>
    );
  }

  if (share) {
    <ShareSocial />;
  }

  if (showPopup) {
    return (
      <>
        {showPopup && (
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
            style={{
              animation: "slideIn 0.5s forwards",
            }}
          >
            <div
              className="bg-white p-8 rounded-lg text-center"
              style={{
                animation: "fadeIn 0.5s forwards",
              }}
            >
              <p className="text-xl font-semibold mb-4">
                Chat is under development
              </p>
              <p className="text-gray-700">Stay tuned for the next version!</p>
              <button
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if(contact){
    return(
      <Contact isOpen={true} listing={listing}  onClose={() => setContact(false)} />
    )
  }

  return (
    <>
      <main>
        {listing && !error && !loading && (
          <Swiper
            navigation
            style={{
              width: window.innerWidth <= 768 ? "100vw" : "75vw",
              objectFit: "contain",
              marginTop: window.innerWidth <= 768 ? "0" : "30px",
              border:"solid 1px white",
              padding:'2px',
              boxShadow:'2px 2px 2px 2px',
              borderRadius:'10px'
            }}
           
          >
            {listing.images.map((url, index) => (
              <SwiperSlide key={index}>
                <div className="h-[500px] relative">
                  <img
                    src={url}
                    alt={`Image ${index}`}
                    className="w-full h-full object-contain rounded-lg"
                    style={{ filter: "brightness(0.8)" }}
                  />
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full border border-gray-600 text-white"
                    onClick={() => handleShare(url)}
                  >
                    <FaShare />
                    {/* {<ShareSocial/>} */}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </main>
      <div className="flex space-between flex-wrap m-4 justify-center">
        <div className="border rounded-lg  w-full md:w-2/4 text-white p-1 shadow-lg" style={{background:'#242424'}}>
          <div>
            <p
              className="p-3 text-4xl font-bold text-white sm:text-thin md:text-4xl text-pretty"
              style={{
                fontStyle: window.innerWidth <= 768 ? "thin" : "normal",
                color:"#fffff"
              }}
            >
              {listing.name}
            </p>
            <div className="flex space-x-6">
              <p className=" text-sm font-thin px-3">
                <span className="inline-block align-middle mr-2">
                  <FaMapMarkerAlt />
                </span>
                {listing.address}
              </p>
              <p className="font-thin">|</p>
              <p className=" text-sm font-thin px-3">
                <span className="inline-block align-middle mr-2">
                  <FaCalendarAlt />
                </span>
                {new Date(listing.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  day: "2-digit",
                })}
              </p>
            </div>
            <p className=" p-3  font-medium text-wrap underline text-white">Description</p>
            <div className="mx-5 text-gray-750 ">
              <ul className="rounded-lg font-medium">
                <li className="block ">{listing.description}</li>
                <li className="block "> For: {listing.type}</li>
                {listing.discountPrice !== 0 && (
                  <li className="block">Discount : ₹{listing.discountPrice}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center  space-y-10 border rounded-lg m-3 text-4xl font-extrabold w-full md:w-1/3 p-4"  style={{background:'#242424'}}>
          <p className=" text-white">₹ {listing.regularPrice} </p>
          {currentUser.user && listing.userRef !== currentUser.user._id && !contact && (
          <button onClick={()=>setContact(true)} className="text-white border  font-semibold rounded-lg border-white mx-2 px-5 py-4 uppercase flex-nowrap xs:text-xs sm:px-3 sm:text-sm hover:bg-gray-300 hover:text-orange-500" >
            contact seller via Email
          </button>
          )}
           {/* {currentUser.user && listing.userRef === currentUser.user._id && (
          <button   className="text-black border  font-semibold bg-white rounded-lg border-black mx-2 px-5 py-4 uppercase flex-nowrap xs:text-xs sm:px-3 sm:text-sm hover:bg-black hover:text-white">
            EDIT INFO
          </button>
          )} */}
        </div>
      </div>
      <div className="flex justify-center ">
        {currentUser.user && listing.userRef !== currentUser.user._id && (
          <button
            onClick={handleChatClick}
            className="w-3/4 my-5  border font-semibold  text-white rounded-lg  border-white mx-2 px-5 py-4  uppercase flex-nowrap xs:text-xs sm:px-3 sm:text-sm  hover:bg-white hover:text-black "
          >
            chat with the seller
          </button>
        )}
      </div>
    </>
  );
}
