// dashboard.js
import { IconDashboard } from '@tabler/icons-react';

const icons = { IconDashboard };

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
