import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";

const Contact = ({ isOpen, onClose, onSubmit, listing }) => {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState("");

  console.log(onClose, "sellerrrrrrrr ");

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        function getCookieValue(cookieName) {
          const cookie = document.cookie
            .split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith(`${cookieName}=`));

          return cookie ? cookie.substring(cookieName.length + 1) : null;
        }
        const accessTokenValue = getCookieValue("access_token");
        console.log(accessTokenValue);

        const token = accessTokenValue;

        const res = await axiosInstance.get(`/user/${listing.userRef}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setSeller(data);
      } catch (err) {
        console.log(err);
      }
    };

    console.log("fetching seller");
    fetchSeller();
  }, [listing.userRef]);

  return (
    <>
      {isOpen && seller && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
          {" "}
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Send a custom message to{" "}
              <span className="text-2xl font-extrabold">
                {seller && `${seller.username}`}
              </span>{" "}
              for <span className="lowercase">{listing.name}</span>
            </h2>

            <textarea
              value={message}
              name="message"
              id="message"
              onChange={handleChange}
              className="w-full h-40 border border-gray-300 rounded-lg p-2 mb-4"
              placeholder="Enter your message..."
            ></textarea>
            <div className="flex justify-center">
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                to={`mailto:${seller.email}?subject=Regarding ${listing.name}&body=${message}`}
              >
                Send Message
              </Link>

              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
