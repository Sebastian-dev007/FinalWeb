import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { Delete, Add, Edit } from "@mui/icons-material";
import { db } from "../../bd/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroInstitucion, setFiltroInstitucion] = useState("");
  const [filtroDocente, setFiltroDocente] = useState("");

  const estadosPosibles = ["Formulación", "Evaluación", "Activo", "Inactivo", "Finalizado"];

  const [selectedProject, setSelectedProject] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [observacion, setObservacion] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "proyectos"));
      const projectList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    } catch (error) {
      console.error("Error al cargar los proyectos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "proyectos", id));
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const handleAddProgress = (id) => {
    console.log(`Agregar avances para el proyecto con ID: ${id}`);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Proyectos", 14, 15);

    const tableColumn = ["Título", "Institución", "Área", "Estado"];
    const tableRows = [];

    projects.forEach((project) => {
      const projectData = [
        project.titulo,
        project.institucion || "No definida",
        project.area || "No definida",
        project.estadoActual?.estado || "Sin estado"
      ];
      tableRows.push(projectData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("reporte_proyectos.pdf");
  };

  const handleOpenChangeState = (project) => {
    setSelectedProject(project);
    setNuevoEstado(project.estadoActual?.estado || "");
    setObservacion("");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProject(null);
  };

  const handleChangeState = async () => {
    if (!selectedProject) return;

    const proyectoRef = doc(db, "proyectos", selectedProject.id);

    const nuevoHistorial = {
      estadoAnterior: selectedProject.estadoActual?.estado || "Sin estado",
      estadoNuevo: nuevoEstado,
      observacion,
      fechaCambio: new Date(),
      usuario: "Coordinador" // Aquí podrías usar el nombre real del usuario si tienes login
    };

    try {
      await updateDoc(proyectoRef, {
        estadoActual: {
          estado: nuevoEstado,
          fechaCambio: new Date(),
        },
        historialEstados: arrayUnion(nuevoHistorial),
      });

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error("Error al cambiar el estado del proyecto:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtrados = projects.filter((p) => {
      const coincideInstitucion = filtroInstitucion === '' || p.institucion?.toLowerCase().includes(filtroInstitucion.toLowerCase());
      const coincideDocente = filtroDocente === '' || p.integrantes?.some(i =>
        `${i.nombre} ${i.apellido}`.toLowerCase().includes(filtroDocente.toLowerCase())
      );
      return coincideInstitucion && coincideDocente;
    });

    setFilteredProjects(
      filtrados.filter((p) =>
        [p.titulo, p.institucion, p.area].some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [projects, searchTerm, filtroInstitucion, filtroDocente]);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Lista de Proyectos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <input
          type="text"
          placeholder="Buscar por título, institución o área"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <input
          type="text"
          placeholder="Filtrar por institución"
          value={filtroInstitucion}
          onChange={(e) => setFiltroInstitucion(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Filtrar por docente"
          value={filtroDocente}
          onChange={(e) => setFiltroDocente(e.target.value)}
          style={{ padding: '8px' }}
        />
      </Box>

      <Button onClick={handleGeneratePDF} variant="outlined" sx={{ mb: 2 }}>
        Generar Reporte PDF
      </Button>

      <List>
        {filteredProjects.map((project) => {
          const isFinalizado = project.estadoActual?.estado === "Finalizado";
          return (
            <ListItem key={project.id} divider>
              <ListItemText
                primary={project.titulo}
                secondary={`Fecha de Inicio: ${
                  project.fechaInicio
                    ? new Date(project.fechaInicio.seconds * 1000).toLocaleDateString()
                    : "No definida"
                }`}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  color="primary"
                  onClick={() => handleAddProgress(project.id)}
                  disabled={isFinalizado}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="info"
                  onClick={() => handleOpenChangeState(project)}
                  disabled={isFinalizado}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(project.id)}
                  disabled={isFinalizado}
                >
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          );
        })}
      </List>

      {filteredProjects.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No hay proyectos registrados.
        </Typography>
      )}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Cambiar Estado del Proyecto</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
            fullWidth
          >
            {estadosPosibles.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Observación"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleChangeState} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
