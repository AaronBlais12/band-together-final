import React, { useState, useEffect } from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

import Welcome from './Components/Welcome/Welcome';
import LearnMore from './Components/Welcome/LearnMore';
 
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import Logout from './Components/Auth/Logout';

import Home from './Components/Home/Home';
import Invite from './Components/Home/Invite';
import ReadProfile from './Components/Home/Profile/ReadProfile';
import EditProfile from './Components/Home/Profile/EditProfile';
import Showfinder from './Components/Home/Showfinder/Showfinder';
import Inbox from './Components/Home/Friends/Inbox';
import Contacts from './Components/Home/Friends/Contacts';
import Direct from './Components/Home/Friends/Messaging/Direct';
import MeetBands from './Components/Home/MeetBands/MeetBands';
import News from './Components/Home/News/News';
import Header from './Components/Home/Nav/Header'
import Footer from './Components/Home/Nav/Footer'

function App() {

  const [ sessionToken, setSessionToken ] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
  })

  const updateLocalStorage = newToken => {
    localStorage.setItem("token", newToken)
    setSessionToken(newToken)
  }

  return (
    <>
    <Routes>
      <Route path='/welcome' element={ <Welcome /> } />
      <Route path='/learnmore' element={ <LearnMore /> } />
      <Route path='/register' element={ <Register updateLocalStorage={updateLocalStorage}/> } />
      <Route path='/login' element={ <Login updateLocalStorage={updateLocalStorage}/> } />
      <Route path='/logout' element={ <Logout/> } />
      <Route element={ <PrivateRoute /> }>
        <Route element={ <><Header /><Footer /><div id="bottom-spacer"></div></> }>
          <Route path='/invite' element={ <Invite /> } />
          <Route path='/profile/:user_id' element={ <ReadProfile /> } />
          <Route path='/findshows' element={ <Showfinder /> } />
          <Route path='/inbox' element={ <Inbox /> } />
          <Route path='/meetbands' element={ <MeetBands /> } />
          <Route path='/friends' element={ <Contacts /> } />
          <Route path='/news' element={ <News /> } />
        </Route>
        <Route path='/profile/edit' element={ <EditProfile /> } />
        <Route path='/' element={ <Home /> } />
        <Route path='/messaging/:otherUser_id' element={ <><Direct /><div id="bottom-spacer"></div></> } />
      </Route>
    </Routes>
    </>
  );
}

export default App;
