import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Pages/Home.jsx'
import { SignIn } from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import Profile from './Pages/Profile.jsx'
import About from './Pages/About.jsx'
import Header from './components/Header/Header.jsx'
import PrivateRoutes from './components/Auth/PrivateRoutes.jsx'
import CreateListing from './Pages/CreateListing.jsx'
import UpdateListing from './Pages/UpdateListing.jsx'
import Listing from './Pages/Listing.jsx'
import Search from './Pages/Search.jsx'
import Footer from './components/Footer/Footer.jsx'

export default function App() {
  return (

    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/sign-in' element={<SignIn/>} />
      <Route path='/sign-up' element={<SignUp/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/search/*' element={<Search/>  }/>
      <Route path='/listing/:id' element={<Listing/>}/>
      <Route  element={<PrivateRoutes/>}>
      <Route path='/profile' element={<Profile/>} />
      <Route path='/create-listing' element={<CreateListing/>} />
      <Route path='/update-listing/:id' element={<UpdateListing/>}/>
      </Route>
    </Routes>
    <Footer/>
    </BrowserRouter>

  )
}
