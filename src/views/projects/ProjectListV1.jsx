import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { db } from "../../bd/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useProjectContext } from "./ProjectContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ListIcon from "@mui/icons-material/List";

export default function ProjectList() {
  const { projects, setProjects, removeProject } = useProjectContext();
  const navigate = useNavigate();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editObjetivoInput, setEditObjetivoInput] = useState("");
  const [editObjetivoIndex, setEditObjetivoIndex] = useState(null);
  const [editIntegranteIndex, setEditIntegranteIndex] = useState(null);
  const [editIntegrante, setEditIntegrante] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    gradoEscolar: "",
  });
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroInstitucion, setFiltroInstitucion] = useState("");
  const [filtroDocente, setFiltroDocente] = useState("");

  const estadosPosibles = [
    "Formulación",
    "Evaluación",
    "Activo",
    "Inactivo",
    "Finalizado",
  ];
  console.log("rol", localStorage.getItem("rol"));

  //Nuevos const

  const [historialModalOpen, setHistorialModalOpen] = useState(false);
  const [cambioEstadoModalOpen, setCambioEstadoModalOpen] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [observacionCambio, setObservacionCambio] = useState("");

  const handleChangeEstado = async (project, nuevoEstado, observacion) => {
    if (!nuevoEstado || !observacion.trim()) {
      alert("Debes seleccionar un estado y agregar una observación.");
      return;
    }

    try {
      const proyectoRef = doc(db, "proyectos", project.id);
      const now = Timestamp.now();

      const nuevoHistorial = {
        estadoAnterior: project.estadoActual?.estado || "Sin estado",
        estadoNuevo: nuevoEstado,
        observacion: observacion.trim(),
        fechaCambio: now,
      };

      const nuevoEstadoActual = {
        estado: nuevoEstado,
        fechaCambio: now,
        observacion: observacion.trim(),
      };

      await updateDoc(proyectoRef, {
        estadoActual: nuevoEstadoActual,
        historialEstados: arrayUnion(nuevoHistorial),
      });

      alert("Estado actualizado exitosamente.");
      fetchProjects(); // para refrescar la lista
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      alert("Error al cambiar el estado. Intenta nuevamente.");
    }
  };

  // const handleChangeEstado = async (project) => {
  //   const nuevoEstado = prompt("Nuevo estado (Formulación, Evaluación, Activo, Inactivo, Finalizado):");
  //   const observacion = prompt("Observación para el cambio de estado:");

  //   if (!estadosPosibles.includes(nuevoEstado)) {
  //     alert("Estado no válido");
  //     return;
  //   }

  //   const proyectoRef = doc(db, "proyectos", project.id);
  //   try {
  //     await updateDoc(proyectoRef, {
  //       estadoActual: { estado: nuevoEstado, observacion, fecha: new Date() },
  //       historialEstados: arrayUnion({ estado: nuevoEstado, observacion, fecha: new Date() })
  //     });
  //     fetchProjects();
  //   } catch (err) {
  //     console.error("Error al cambiar el estado:", err);
  //   }
  // };

  const handleGeneratePDF = () => {
    const docu = new jsPDF();
    docu.text("Reporte de Proyectos", 14, 15);

    const tableColumn = ["Título", "Institución", "Área", "Estado"];
    const tableRows = [];

    projects.forEach((project) => {
      const projectData = [
        project.titulo,
        project.institucion || "No definida",
        project.area || "No definida",
        project.estadoActual?.estado || "Sin estado",
      ];
      tableRows.push(projectData);
    });

    autoTable(docu, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    docu.save("reporte_proyectos.pdf");
  };

  // Función para cargar los proyectos desde Firestore

  //se necesita que se muestre el estado actual del proyecto
  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "proyectos"));
      const projectList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        // Agregar el estado actual del proyecto

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
      removeProject(id);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };


  const handleEdit = (project) => {
    setSelectedProject({
      ...project,
      objetivos: Array.isArray(project.objetivos)
        ? project.objetivos
        : project.objetivos
        ? [project.objetivos]
        : [],
      integrantes: Array.isArray(project.integrantes)
        ? project.integrantes
        : project.integrantes
        ? [project.integrantes]
        : [],
    });
    setEditModalOpen(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedProject(null);
  };

  // Función para guardar los cambios del proyecto
  const handleSaveChanges = async () => {
    if (selectedProject) {
      try {
        const projectRef = doc(db, "proyectos", selectedProject.id);
        await updateDoc(projectRef, selectedProject);
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === selectedProject.id ? selectedProject : project
          )
        );
        handleCloseEditModal();
      } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
      }
    }
  };

  


 

  // Integrantes: iniciar edición
  const handleStartEditIntegrante = (idx) => {
    setEditIntegranteIndex(idx);
    setEditIntegrante(selectedProject.integrantes[idx]);
  };

  // Integrantes: guardar edición
  const handleSaveEditIntegrante = (idx) => {
    const nuevos = [...selectedProject.integrantes];
    nuevos[idx] = editIntegrante;
    setSelectedProject({ ...selectedProject, integrantes: nuevos });
    setEditIntegranteIndex(null);
    setEditIntegrante({
      nombre: "",
      apellido: "",
      identificacion: "",
      gradoEscolar: "",
    });
  };

  // Integrantes: cancelar edición
  const handleCancelEditIntegrante = () => {
    setEditIntegranteIndex(null);
    setEditIntegrante({
      nombre: "",
      apellido: "",
      identificacion: "",
      gradoEscolar: "",
    });
  };

  // Eliminar Integrantes
  const handleRemoveIntegranteEdit = (idx) => {
    setSelectedProject({
      ...selectedProject,
      integrantes: selectedProject.integrantes.filter((_, i) => i !== idx),
    });
  };

  // agregar Integrantes
  const handleAddIntegranteEdit = () => {
    setSelectedProject({
      ...selectedProject,
      integrantes: [
        ...(selectedProject.integrantes || []),
        { nombre: "", apellido: "", identificacion: "", gradoEscolar: "" },
      ],
    });
  };



  // Cargar los proyectos al montar el componente
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtrados = projects.filter((p) => {
      const coincideInstitucion =
        filtroInstitucion === "" ||
        p.institucion?.toLowerCase().includes(filtroInstitucion.toLowerCase());
      const coincideDocente =
        filtroDocente === "" ||
        p.integrantes?.some((i) =>
          `${i.nombre} ${i.apellido}`
            .toLowerCase()
            .includes(filtroDocente.toLowerCase())
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
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: 700, md: 1100, lg: 1400 },
        mx: "auto",
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2, md: 4 },
      }}
    >
      {/* Filtros de búsqueda */}
      <Paper
        elevation={3}
        sx={{
          mb: { xs: 2, sm: 4 },
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 4 },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Buscar por título, institución o área"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filtrar por institución"
              value={filtroInstitucion}
              onChange={(e) => setFiltroInstitucion(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filtrar por docente"
              value={filtroDocente}
              onChange={(e) => setFiltroDocente(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Button
            onClick={handleGeneratePDF}
            variant="outlined"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Generar Reporte PDF
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          mb: { xs: 2, sm: 4 },
          borderRadius: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary.main"
          gutterBottom
          sx={{
            fontSize: { xs: 22, sm: 28, md: 32 },
          }}
        >
          Lista de Proyectos
        </Typography>
        <Divider sx={{ mb: { xs: 2, sm: 3 } }} />
        <List>
          {filteredProjects.map((project) => (
            <ListItem
              key={project.id}
              divider
              sx={{
                bgcolor: "#f5f7fa",
                borderRadius: 2,
                mb: 2,
                boxShadow: 1,
                flexDirection: "column",
                alignItems: "stretch",
                "&:hover": { boxShadow: 4, bgcolor: "#e3e9f7" },
                transition: "all 0.2s",
                px: { xs: 1, sm: 2 },
                minHeight: { xs: 150, sm: 80 },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ fontSize: { xs: 16, sm: 20 } }}
                  >
                    {project.titulo}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: 13, sm: 15 } }}
                    >
                      Fecha de Inicio:{" "}
                      {project.fechaInicio && project.fechaInicio.seconds
                        ? new Date(
                            project.fechaInicio.seconds * 1000
                          ).toLocaleDateString()
                        : "No definida"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: 13, sm: 15 } }}
                    >
                      Estado Actual:{" "}
                      {project.estadoActual?.estado || "Sin estado"}
                    </Typography>
                  </>
                }
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  width: "100%",
                  mt: 1,
                }}
              >
                <Tooltip title="Ver Historial de Estados" placement="top">
                  <IconButton
                    color="info"
                    onClick={() => {
                      setSelectedProject(project);
                      setHistorialModalOpen(true);
                    }}
                    sx={{ minWidth: 40, minHeight: 48 }}
                  >
                    <ListIcon /> {/* Puedes usar otro icono si prefieres */}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cambiar Estado" placement="top">
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setSelectedProject(project);
                      setEstadoSeleccionado("");
                      setObservacionCambio("");
                      setCambioEstadoModalOpen(true);
                    }}
                    sx={{ minWidth: 40, minHeight: 48 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Ver Detalle" placement="top">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/projectDetail/${project.id}`)}
                    sx={{
                      minWidth: 40,
                      minHeight: 48,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar" placement="top">
                  <IconButton
                    color="default"
                    onClick={() => handleEdit(project)}
                    sx={{
                      minWidth: 40,
                      minHeight: 48,
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Dialog
                  open={historialModalOpen}
                  onClose={() => setHistorialModalOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>Historial de Estados</DialogTitle>
                  <DialogContent>
                    {selectedProject?.historialEstados?.length > 0 ? (
                      selectedProject.historialEstados.map((h, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid #ccc",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>De:</strong> {h.estadoAnterior} →{" "}
                            <strong>A:</strong> {h.estadoNuevo}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Observación:</strong> {h.observacion}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Fecha:</strong>{" "}
                            {h.fechaCambio?.toDate().toLocaleString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No hay historial disponible.</Typography>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setHistorialModalOpen(false)}
                      color="primary"
                    >
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={cambioEstadoModalOpen}
                  onClose={() => setCambioEstadoModalOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle>Cambiar Estado del Proyecto</DialogTitle>
                  <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <TextField
                          select
                          fullWidth
                          value={estadoSeleccionado}
                          onChange={(e) =>
                            setEstadoSeleccionado(e.target.value)
                          }
                          SelectProps={{ native: true }}
                        >
                          <option value="">Selecciona un estado</option>
                          {estadosPosibles.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Observación"
                          multiline
                          value={observacionCambio}
                          onChange={(e) => setObservacionCambio(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setCambioEstadoModalOpen(false)}
                      color="secondary"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={async () => {
                        await handleChangeEstado(
                          selectedProject,
                          estadoSeleccionado,
                          observacionCambio
                        );
                        setCambioEstadoModalOpen(false);
                      }}
                      color="primary"
                      variant="contained"
                    >
                      Guardar Cambio
                    </Button>
                  </DialogActions>
                </Dialog>
                {/* evaluar mediante un condicional que si el "estudiante" no se debe mostrar el boton de eliminar*/}
                {localStorage.getItem("rol") !== "estudiante" && (
                  <Tooltip title="Eliminar" placement="top">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(project.id)}
                      sx={{
                        minWidth: 40,
                        minHeight: 48,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
        {projects.length === 0 && (
          <Typography variant="body1" color="textSecondary">
            No hay proyectos registrados.
          </Typography>
        )}
      </Paper>

      {/* Modal de edición */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Editar Proyecto</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Grid
              container
              spacing={2}
              sx={{ padding: { xs: 1, sm: 2, md: 3 } }}
            >
              {/* Primera fila: Título, Área, Presupuesto */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Título"
                  value={selectedProject.titulo}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      titulo: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Área"
                  value={selectedProject.area || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      area: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Presupuesto"
                  value={selectedProject.presupuesto || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      presupuesto: e.target.value,
                    })
                  }
                />
              </Grid>
              {/* Segunda fila: Institución */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institución"
                  value={selectedProject.institucion || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      institucion: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Objetivos"
                  value={selectedProject.institucion || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      institucion: e.target.value,
                    })
                  }
                />
              </Grid>

              
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Integrantes
                </Typography>
                {(selectedProject.integrantes || []).map((integrante, idx) =>
                  editIntegranteIndex === idx ? (
                    <Grid container spacing={1} key={idx} sx={{ mb: 1 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          size="small"
                          label="Nombre"
                          value={editIntegrante.nombre}
                          onChange={(e) =>
                            setEditIntegrante({
                              ...editIntegrante,
                              nombre: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          size="small"
                          label="Apellido"
                          value={editIntegrante.apellido}
                          onChange={(e) =>
                            setEditIntegrante({
                              ...editIntegrante,
                              apellido: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          size="small"
                          label="Identificación"
                          value={editIntegrante.identificacion}
                          onChange={(e) =>
                            setEditIntegrante({
                              ...editIntegrante,
                              identificacion: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2}>
                        <TextField
                          size="small"
                          label="Grado Escolar"
                          value={editIntegrante.gradoEscolar}
                          onChange={(e) =>
                            setEditIntegrante({
                              ...editIntegrante,
                              gradoEscolar: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={1}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => handleSaveEditIntegrante(idx)}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={handleCancelEditIntegrante}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ) : (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={`${integrante.nombre} ${integrante.apellido} (${integrante.identificacion}) - ${integrante.gradoEscolar}`}
                        onDelete={() => handleRemoveIntegranteEdit(idx)}
                        deleteIcon={<CloseIcon />}
                        clickable
                        onClick={() => handleStartEditIntegrante(idx)}
                        icon={<EditIcon />}
                        variant="outlined"
                        sx={{ fontSize: 14 }}
                      />
                    </Box>
                  )
                )}
                <Button
                  onClick={handleAddIntegranteEdit}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Agregar Integrante
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            variant="contained"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      {filteredProjects.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No hay proyectos registrados.
        </Typography>
      )}
    </Box>
  );
}
