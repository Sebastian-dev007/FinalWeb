import { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext debe ser usado dentro de un ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const removeProject = (id) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ projects, setProjects, addProject, removeProject }}>
      {children}
    </ProjectContext.Provider>
  );
};