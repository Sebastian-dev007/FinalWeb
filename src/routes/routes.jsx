import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import RouteController from './RouteController'

// Lazy-loaded components
// const Dashboard = lazy(() => import('../components/views/Dashboard'))
const Login = lazy(() => import('../views/Login'))
const Home = lazy(() => import('../views/Home'))

// const Estudiante = lazy(() => import('../components/views/Estudiante'))
// const Docente = lazy(() => import('../components/views/Docente'))
// const Coordinador = lazy(() => import('../components/views/Coordinador'))

const routes = [
    // {
    //     path: '/',
    //     element: <Navigate to="/login" replace />,
    // },
    // {
    //     path: '/login',
    //     element: <Login />,
    // },
    // {
    //     path: '/app/estudiante',
    //     element: (
    //         <RouteController>
    //             <Estudiante />
    //         </RouteController>
    //     ),
    // },
    // {
    //     path: '/app/docente',
    //     element: (
    //         <RouteController>
    //             <Docente />
    //         </RouteController>
    //     ),
    // },
    {
        path: '/app',
        element: (
          <RouteController >
            <Home />
          </RouteController>
        )
    }
      
]


export default routes
