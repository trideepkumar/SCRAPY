import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../Firebase/Firebase';
import axiosInstance from '../api/axiosInstance';
import { signInSuccess } from '../redux/user/userSlice.jsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OAuth() {

    const dispatch =  useDispatch()
const navigate = useNavigate()

    const handleGoogleClick = async ()=>{
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result =  await signInWithPopup(auth,provider)
            const res = await axiosInstance.post('/auth/google',{
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
            })
            console.log("hello data here", res)
            const data =  res.data
            console.log(data)
            dispatch(signInSuccess(data))
            navigate('/')
        }catch(err){
            console.log("Google sigin error!!!",err)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center uppercase hover:opacity-95'>
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      Continue with Google
    </button>
  );
}

export default OAuth;
