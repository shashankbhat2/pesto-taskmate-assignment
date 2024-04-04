import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Outlet, Navigate } from 'react-router-dom'
import Spinner from './ui/spinner'

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) {
        return <Spinner />
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}


export default PrivateRoute;



