import React from "react";
import Layout from "../Layout";
import { Outlet } from "react-router-dom";
import UserManagement from "../admin/UserManagement";
// import CrearProyecto from "../../proyectos/CrearProyecto";
// import Dashboard from "../Dashboard/Dashboard";
import { useState, useEffect } from "react";

const Home = () => {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);
  }, []);

  console.log("Rol actual: ", rol);
  
  const renderPorRol = () => {
    switch (rol) {
      case "docente":
        return <CrearProyecto />;
      case "coordinador":
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      
      <h2>Bienvenido al Sistema de Gestión de Proyectos</h2>
      <Dashboard />
      <div style={{ marginTop: 24 }}>{renderPorRol()}</div>
      <Outlet />
    </Layout>
  );
};

export default Home;
