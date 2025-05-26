import { RouterProvider } from 'react-router-dom';
import { ProjectProvider } from './views/projects/ProjectContext';
// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <ProjectProvider>
          <RouterProvider router={router} />
        </ProjectProvider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
