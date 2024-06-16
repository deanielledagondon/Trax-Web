// import { Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import React, { useState, useEffect } from 'react';

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
        {/* <Routes>
          <Route path={'/'} element={<Login setToken={setToken}/>}/>
          <Route path={'/register'} element={<Register/>}/>
          {token?<Route path={'/dashboard'} element={<Dashboard/>}/>:""}
        </Routes> */}

        <RouterProvider router = {router}/>

      </div>
  )
}

export default App
