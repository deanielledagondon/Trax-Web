import './App.css'
import React from 'react';

import Dashboard from './Screens/Dashboard/Dashboard'
import Login from './Screens/Login/Login'
import Register from './Screens/Register/Register'

import Queue from './Screens/Queue/Queue'
import LogHistory from './Screens/Logbook/LogHistory'
import Analytics from './Screens/Analytics/Analytics'
import Feedback from './Screens/Feedback/Feedback'


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
