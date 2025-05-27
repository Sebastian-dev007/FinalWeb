import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import RouteController from './RouteController';


const Home = Loadable(lazy(() => import('../views/Home')));
const Login = Loadable(lazy(() => import('../views/Login')));
const Projects = Loadable(lazy(() => import('../views/projects/ProjectAdd')));
const ProjectsDetail = Loadable(lazy(() => import('../views/projects/ProjectDetail')));
const MainP = Loadable(lazy(() => import('layout/MainLayout')));
const Users = Loadable(lazy(() => import('../views/admin/UserManagement')));



const MainRoutes = {
  path: '/',
  element: (
    <RouteController>
      <MainP />
    </RouteController>
  ),
  children: [
    {
      path: 'dashboard/default',
      element: (
        <RouteController>
          <Projects />
        </RouteController>
      )
    },
    
    {
      path: '/usuarios',
      element: (
        <RouteController >
          <Users />
        </RouteController>
      )
    },
    {
      path: 'projectList',
      element: (
        <RouteController>
          <Projects />
        </RouteController>
      )
    },
    {
      path: 'projectDetail/:id',
      element: (
        <RouteController>
          <ProjectsDetail />
        </RouteController>
      )
    },
    {
      path: 'projects',
      element: (
        <RouteController>
          <Projects />
        </RouteController>
      )
    },
    //error page
    {
      path: '*',
      element: (
        <RouteController>
          <h1>404 - </h1>
        </RouteController>
      )


    }
  ]
};


export default MainRoutes;
