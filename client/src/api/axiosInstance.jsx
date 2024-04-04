import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://scrapy-v6.onrender.com/api/',
  // baseURL: 'http://localhost:3000/api/',

  //timeout implementation
  
  headers: {
    'Content-Type': 'application/json',
     withCredentials: true,
  },
});

export default axiosInstance;