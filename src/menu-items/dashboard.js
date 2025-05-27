// dashboard.js
import { IconDashboard } from '@tabler/icons-react';

const icons = { IconDashboard };

//Funcion para obtener el dashboard según el rol
const getDashboard = (rol) => {
  console.log('El rol es:', rol);
  const children = [
    {
      id: 'default',
      title: 'Proyectos',
      type: 'item',
      url: '/projectList',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ];
// Condicional para negar el acceso a ciertas rutas según el rol
  if (rol !== 'estudiante' && rol !== 'docente') {
    children.push({
      id: 'usuarios',
      title: 'Usuarios',
      type: 'item',
      url: '/usuarios',
      icon: icons.IconDashboard,
      breadcrumbs: false
    });
  }

  return {
    id: 'dashboard',
    title: 'Funciones',
    type: 'group',
    children
  };
};

export default getDashboard;
