import './App.css'
import React, { useState, useEffect } from 'react';

import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'

import Queue from './Components/Queue/Queue'
import LogHistory from './Components/Logbook/LogHistory'
import Analytics from './Components/Analytics/Analytics'
import Feedback from './Components/Feedback/Feedback'


import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login/></div>
  },

  {
    path: '/register',
    element: <div><Register/></div>
  },

  {
    path: '/dashboard',
    element: <div><Dashboard/></div>
  },
  {
    path: '/queue',
    element: <div><Queue/></div>
  },

  {
    path: '/logbook',
    element: <div><LogHistory/></div>
  },

  {
    path: '/analytics',
    element: <div><Analytics/></div>
  },

  {
    path: '/feedback',
    element: <div><Feedback/></div>
  },

])


function App() {
  const [token, setToken] = useState(false)

  if(token){
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(()=>{
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  })

  return (
      <div>
        <RouterProvider router={router} />
        </div>

  );
}

export default App
