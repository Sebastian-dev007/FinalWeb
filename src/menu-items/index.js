// import dashboard from './dashboard';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';
// menu-items.js
import getDashboard from './dashboard'; // O tu archivo del menú de funciones

const getMenuItems = (rol) => {
  return {
    items: [
      getDashboard(rol)
    ]
  };
};

export default getMenuItems;
