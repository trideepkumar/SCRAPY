import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import axiosInstance from '../api/axiosInstance'
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading,setLoading]= useState(false)
  const [error,setError]=useState(null)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

 
   const handleSubmit = (e)=>{
    e.preventDefault()
    setLoading(true)
    axiosInstance
  .post("/auth/signup", formData)
  .then((res) => {
    console.log(res.data)
    if (res.status === 201) {
      console.log("res.status", res.status)
      setLoading(false);
      navigate('/sign-in')
     }
  })
  .catch((error) => { 
    setLoading(false);
      setError(error.response.data.message);
      return;
  });

  };

  console.log(formData)

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
         { loading ? 'Loading...' : 'sign up'}
        </button>
        <OAuth/>
      </form>

      <div className="flex gap-2 mt-5 ">
        <p>Have an account ?</p>
        <Link to={"/sign-in"} className="text-blue-700">
          Sign in
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
    </div>
  );
}
