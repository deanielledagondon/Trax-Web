import './App.css'
import React from 'react';

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

import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

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
    element: <div><ProtectedRoute element={<Dashboard />}/></div>
  },
  {
    path: '/queue',
    element: <div><ProtectedRoute element={<Queue />}/></div>
  },

  {
    path: '/logbook',
    element: <div><ProtectedRoute element={<LogHistory />}/></div>
  },

  {
    path: '/analytics',
    element: <div><ProtectedRoute element={<Analytics />}/></div>
  },

  {
    path: '/feedback',
    element: <div><ProtectedRoute element={<Feedback />}/></div>
  },

])


function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

  );
}

export default App
