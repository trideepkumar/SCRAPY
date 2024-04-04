import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
// import { useCookies } from "react-cookie";
import Cookies from 'js-cookie';

export function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const [cookies, setCookie] = useCookies(["auth-token"]);

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart())
    try {
      const response = await axiosInstance.post("/auth/signin", formData, { credentials: 'include' });
      if (response.status === 200) {
        console.log(response.data)
        const token = response.data.token
        const setCookie = (token) => {
          Cookies.set('access_token', token, { expires: 7 }); 
        };        
        setCookie(token)  
        dispatch(signInSuccess(response.data));
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        dispatch(signInFailure(error.response.data.message));
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        dispatch(signInFailure("No response received from the server."));
      } else {
        console.error("Error setting up the request:", error.message);
        dispatch(signInFailure("Error setting up the request."));
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          value={formData.password}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-white-700 border hover:bg-white hover:border-black hover:text-black  text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"} className="text-blue-300">
          Sign up
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
    </div>
  );
}
