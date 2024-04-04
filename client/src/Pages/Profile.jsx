import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase/Firebase.jsx";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice.jsx";
import axiosInstance from "../api/axiosInstance.jsx";
import { useNavigate, Link } from "react-router-dom";
import ConfirmationModal from "../components/Modals/ConfirmationModal.jsx";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [showListingError, setShowlistingError] = useState(false);
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    //for the percentage calculation in the profile picture upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
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

      const res = await axiosInstance.post(
        `/user/update/${currentUser.user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log("hello world");
        console.log(document.cookie);
        dispatch(updateUserSuccess(res.data));
        setSuccessUpdate(true);
      } else {
        dispatch(updateUserFailure(res.data.message));
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
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

      console.log("here is delete token", token);

      const res = await axiosInstance.delete(
        `/user/deleteUser/${currentUser.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        console.log("user deleted successfully");
        dispatch(deleteUserSuccess(res.data));
      } else {
        dispatch(deleteUserFailure(res.data.message));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    dispatch(signoutUserStart());

    try {
      const res = await axiosInstance.post("/auth/signout");
      const data = await res.json();

      if (res.status === 200) {
        console.log(data);
        dispatch(signoutUserSuccess(data));
        navigate("/sign-in");
      } else {
        dispatch(signoutUserFailure(data.message));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleListing = async () => {
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
      const res = await axiosInstance.get(
        `user/listings/${currentUser.user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        setShowlistingError(false);
        const data = res.data;
        setListings(data);
        console.log(data);
        window.scrollTo({
          top: window.innerHeight, 
          behavior: 'smooth' 
        });
      } else {
        setShowlistingError(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteList = async (id) => {
    console.log("id", id);
    try {
      console.log("handleDeleteLsit");
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
      const res = await axiosInstance.delete(`/listing/deleteList/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        console.log(res.status);
        setListings((prevListings) =>
          prevListings.filter((listing) => listing._id !== id)
        );
        setShowModal(false);
      } else {
        console.log("error in deleting list!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteButtonClick = (id) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  return (
    <>
      <div className="p-3 max-w-lg mx-auto ">
        <h1 className="text-3xl font-semibold text-center text-white underline my-7">{currentUser.user.username}</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            className="rounded-e h-24 w-24 object-cover cursor-pointer self-center mt-2 border border-white p-1"
            src={formData?.avatar || currentUser.user.avatar}
            alt=""
          />

          <p className="text-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image Upload(image must be below 2mb)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-green-700">{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-800">
                Profile Pic Updated Successfully!
              </span>
            ) : (
              ""
            )}
          </p>

          <input
            type="text"
            id="username"
            placeholder="username"
            className="border p-3  rounded-lg"
            defaultValue={currentUser.user.username}
            onChange={handleChange}
            style={{ background: "#242424", color: "#9BA3AF" }}
          />
          <input
            type="email"
            id="email"
            placeholder="email "
            className="border p-3  rounded-lg"
            defaultValue={currentUser.user.email}
            onChange={handleChange}
            style={{ background: "#242424", color: "#9BA3AF" }}
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            // value='Reset Password'
            disabled={true}
            className="border p-3  rounded-lg text-white"
            onChange={handleChange}
            style={{ background: "#242424" }}
          />
          <button
            disabled={loading}
            className=" text-white border rounded-lg p-3 uppercase hover:opacity-95 hover:bg-gray-100  hover:text-black disabled:opacity-80"
          >
            {loading ? "loading" : "update"}
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDelete}
            className=" cursor-pointer hover:text-red-600"
            // style={{ color: "#E68282" }}
          >
            {" "}
            Delete account{" "}
          </span>
          <span
            onClick={handleSignout}
            className=" cursor-pointe hover:text-red-600"
            
          >
            {" "}
            sign out{" "}
          </span>
        </div>
        <p className="text-red-400 mt-5 text-center">{error ? error : ""}</p>
        <p className="text-green-700 mt-5 text-center">
          {successUpdate ? "Profile Updated Successfully !!" : ""}
        </p>
      </div>
      <div className="p-2 max-w-lg mx-auto ">
        <Link
          to={"/create-listing"}
          className=" flex justify-center align-center hover:text-white  bg-blue-300   p-3 rounded-lg uppercase text-center hover:opacity-100 text-black"
        >
          Create Your List To Sell
        </Link>
        <button
          onClick={handleListing}
          className="w-full text-white border  bold p-2 my-5 rounded-md hover:bg-gray-100 hover:text-black"
        >
          Show Your Sell Listings
        </button>

      </div>
      <div>
       
        {listings && listings.length > 0 && (
          <div>
            <h1 className="text-center my-7 text-2xl   font-semibold">
              {" "}
              Your Ad's Below.
            </h1>
            {listings.map((list) => (
              <div
                key={list._id}
                className="border rounded-lg p-3 flex flex-col sm:flex-row justify-between items-center m-5 gap-4 sm:gap-6"
              >
                <Link to={`/listing/${list._id}`} className="flex-shrink-0">
                  <img
                    src={list.images[0]}
                    alt="listing cover image"
                    className="h-20 w-20 object-contain rounded-lg border border-white p-1 "
                  />
                </Link>
                <Link
                  className="flex-2 text-slate-700 font-semibold overflow-scroll truncate hover:underline "
                  to={`/listing/${list._id}`}
                  style={{ maxWidth: "calc(100% - 160px)" }}
                >
                  <p className="text-white hover:underline">{list.name}</p>
                </Link>
                <div className="flex justify-end sm:justify-start">
                  <button
                    onClick={() => handleDeleteButtonClick(list._id)}
                    className="text-red-700 border p-2 rounded-lg border-red-400 mx-2"
                  >
                    DELETE
                  </button>
                  <Link to={`/update-listing/${list._id}`}>
                    <button className="text-blue-400 border p-2 rounded-lg border-blue-400 mx-2 px-5">
                      EDIT
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-red-400 mt-5 text-center">
          {showListingError ? "Error in showing Listings !" : ""}
        </p>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDeleteList(selectedItemId)}
      />
    </>
  );
}
