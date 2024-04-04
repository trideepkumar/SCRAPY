
import React, { useEffect, useRef, useState } from "react";
import { app } from "../Firebase/Firebase.jsx";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axiosInstance from "../api/axiosInstance.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    name: "",
    category: "",
    description: "",
    address: "",
    type: "",
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
  });
  const [imageuploadError, setImageuploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);

  console.log(formData);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category/getCategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImage = (e) => {
    setLoading(true);
    e.preventDefault();

    if (files.length > 0 && files.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            images: formData.images.concat(urls),
          });
          setImageuploadError(false);
          setLoading(false);
        })
        .catch((err) => {
          setImageuploadError("Only less than 2mb files is supported !");
        });
    } else {
      setImageuploadError("Maximum 6 images is to be uploaded !");
      setLoading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`${progress}% uploaded`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;

    if (type === "number" || type === "text" || type === "textarea") {
      setFormData({
        ...formData,
        [id]: value,
      });
    } else if (id === "type" || id === "category") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.images.length < 1) {
        return setError("Upload atleast 1 image !");
      }
      if (formData.regularPrice < formData.discountPrice) {
        return setError(
          "Discount Price must be lower than the Regular Price !"
        );
      }
      if (!formData.category) {
        return setError("Please select a category !");
      }
      setLoader(true);
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
        "/listing/create",
        {
          ...formData,
          userRef: currentUser.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("helo ress");

      const data = await res;
      if (data.status === 200) {
        setLoader(false);
        navigate(`/listing/${data.data._id}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <main className="p-3 max-w-4xl mx-auto ">
      <h1 className="text-3xl  font-semibold text-center my-7">Create List </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Ad's Title"
            className="border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
            style={{ background: "#242424", color: "white" }}
          />
          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
            style={{ background: "#242424", color: "white" }}
          />
          <input
            type="text"
            placeholder="Your Adress"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
            style={{ background: "#242424", color: "white" }}
          />
          <select
            className="border p-3 rounded-lg bg-transparent text-gray-400"
            id="category"
            onChange={handleChange}
            value={formData.category}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-lg bg-transparent text-gray-400"
            id="type"
            onChange={handleChange}
            value={formData.type}
            required
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>

          <div className="flex flex-wrap gap-6 mx-auto">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="100000000000"
                placeholder="regularprice"
                className="border p-3 w-full sm:w-[420px] rounded-lg"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                style={{ background: "#242424", color: "white" }}
              />

              {/* <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-gray-400 text-xs"></span>
              </div> */}
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  className="p-3 rounded-lg border"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  style={{ background: "#242424", color: "white" }}
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-gray-400 text-xs">($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="gap-4 rounded w-full flex flex-col flex-1 m-1">
          <div
            onClick={() => fileRef.current.click()}
            className="cursor-pointer text-gray-400 border p-3 rounded-lg text-center "
          >
            {" "}
            Click to upload images
          </div>
          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            id="images"
            ref={fileRef}
            accept="image/*"
            multiple
            hidden
            className="border p-3 rounded-lg "
            required
          />
          <div className="">
            <p className="font-semibold m-5">
              Upload Images{" "}
              <span className="font-normal ml-2 text-xs text-gray-400 ">
                (maximum 6 images is to be uploaded)
              </span>
            </p>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={handleImage}
            className="p-3 m-5  border border-gray-400 text-white hover:text-black rounded uppercase hover:shadow-md hover:bg-gray-200 disabled:opacity-80"
          >
            {loading ? "loading..." : "upload"}
          </button>
          <p className="text-red-500 text-center font-extralight text-sm">
            {imageuploadError && imageuploadError}
          </p>
          {formData.images.length > 0 &&
            formData.images.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="list of images"
                  className="w-20 h-20 object-contain rounded-lg border border-white p-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-500 hover:border hover:border-red-800 rounded-lg uppercase hover:opacity-50"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loader || loading}
            className="p-3 m-5 text-white border hover:bg-white rounded-lg uppercase hover:opacity-95 hover:text-black disabled:opacity-70"
          >
            {loader ? "Posting the ad..." : "Create List"}
          </button>
          {error && (
            <p className="text-red-400 text-center text-sm font-mono">
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
