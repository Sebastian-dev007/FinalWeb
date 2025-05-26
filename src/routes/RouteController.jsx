import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// const RouteController = ({ children, allowedRoles = [] }) => {
//   const authData = localStorage.getItem('auth')
//   const userRole = localStorage.getItem('rol')
//   localStorage.setItem('auth', 'yes') // sin comillas extra
//   const isAuth = authData === 'yes'

//   const location = useLocation()

//   if (!isAuth) {
//     return <Navigate to="/login" replace state={{ from: location }} />
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/login" replace /> 
//   }

//   return children
// }

const RouteController = ({ children, allowedRoles = [] }) => {
  const authData = localStorage.getItem('auth')
  const userRole = localStorage.getItem('rol')
  const isAuth = authData === 'yes'
  const location = useLocation()

  // Depuración
  console.log('isAuth:', isAuth, 'userRole:', userRole, 'allowedRoles:', allowedRoles)

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RouteController
