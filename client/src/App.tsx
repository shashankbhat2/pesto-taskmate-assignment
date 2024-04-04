import React, { Fragment } from 'react'
import { AuthProvider } from './context/AuthContext'
import {
  Route,
  Routes,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardHome from './pages/dashboard/DashboardHome';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<DashboardHome />} />
          </Route>
        </Routes>
      </AuthProvider>
      <Toaster position="top-center" richColors={true} theme="light"/>
    </Fragment>
  )
}

export default App
