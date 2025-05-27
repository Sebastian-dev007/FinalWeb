// Importa funciones de React para crear el contexto y hooks
import { createContext, useState, useContext } from 'react';

// Crea el contexto para los proyectos
const ProjectContext = createContext();

// Hook personalizado para consumir el contexto de proyectos
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  // Lanza un error si el hook se usa fuera del proveedor
  if (!context) {
    throw new Error('useProjectContext debe ser usado dentro de un ProjectProvider');
  }
  return context;
};

// Proveedor del contexto de proyectos
export const ProjectProvider = ({ children }) => {
  // Estado que almacena la lista de proyectos
  const [projects, setProjects] = useState([]);

  // Función para agregar un nuevo proyecto al estado
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  // Función para eliminar un proyecto por su id
  const removeProject = (id) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
  };

  // Proporciona el estado y las funciones a los componentes hijos
  return (
    <ProjectContext.Provider value={{ projects, setProjects, addProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  );
};