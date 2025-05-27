// Importaciones de React y librerías necesarias
import React, { useState, useEffect, Suspense, useMemo } from 'react';

// Importación dinámica de componentes de MUI para optimizar carga
const CardMedia = React.lazy(() => import('@mui/material/CardMedia'));
const Avatar = React.lazy(() => import('@mui/material/Avatar'));
const Stack = React.lazy(() => import('@mui/material/Stack'));

// Importación de react-pdf para visualizar archivos PDF
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Importaciones de React Router y Firebase
import { useParams } from 'react-router-dom';
import { db } from '../../bd/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Axios para peticiones HTTP
import axios from 'axios';

// Importaciones de componentes de Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

// Iconos de Material UI
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

// Estilos personalizados
import './ProjectDetail.css';


export default function ProjectDetail() {
  // Obtiene el ID del proyecto desde la URL
  const { id } = useParams();

  // Estado para almacenar los datos del proyecto y los avances
  const [project, setProject] = useState({ avances: [] });

  // Estado para el formulario de nuevo avance
  const [newAdvance, setNewAdvance] = useState({
    fecha: '',
    descripcion: '',
    imagen: null,
    documento: null,
  });

  // Hook para cargar los datos del proyecto desde Firestore al montar el componente
  useEffect(() => {
    let mounted = true;
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'proyectos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && mounted) {
          setProject(prev => {
            const newData = { id: docSnap.id, ...docSnap.data() };
            // Solo actualiza si hay cambios
            return JSON.stringify(prev) !== JSON.stringify(newData) ? newData : prev;
          });
        } else {
          console.error('No se encontró el proyecto');
        }
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
      }
    };

    fetchProject();
    return () => { mounted = false; };
  }, [id]);

  // Maneja los cambios en los campos del formulario de avance
  const handleInputChange = (e) => {
    setNewAdvance({
      ...newAdvance,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja la subida de archivos (imagen o documento)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Sube el archivo al backend y actualiza el estado
      const archivo = await subirArchivo(formData, id, e.target.name);
      setNewAdvance((prev) => ({
        ...prev,
        [e.target.name]: archivo,
      }));
    } catch (error) {
      console.error('Error al subir archivo:', error);
    }
  };

  // Añade un nuevo avance al proyecto (imagen y/o documento)
  const handleAddAdvance = async () => {
    try {
      // Si hay imagen, guarda el avance en Firestore
      if (newAdvance.imagen) {
        await guardarAvanceEnFirestore(id, {
          ...newAdvance.imagen,
          descripcion: newAdvance.descripcion,
          fecha: newAdvance.fecha || new Date().toISOString(),
        });
      }
      // Si hay documento, guarda el avance en Firestore
      if (newAdvance.documento) {
        await guardarAvanceEnFirestore(id, {
          ...newAdvance.documento,
          descripcion: newAdvance.descripcion,
          fecha: newAdvance.fecha || new Date().toISOString(),
        });
      }
      // Actualiza el estado local para mostrar el avance en la interfaz
      setProject({
        ...project,
        avances: [
          ...(project.avances || []),
          ...(newAdvance.imagen ? [{ ...newAdvance.imagen, descripcion: newAdvance.descripcion, fecha: newAdvance.fecha || new Date().toISOString() }] : []),
          ...(newAdvance.documento ? [{ ...newAdvance.documento, descripcion: newAdvance.descripcion, fecha: newAdvance.fecha || new Date().toISOString() }] : []),
        ],
      });
      // Limpia el formulario de avance
      setNewAdvance({
        fecha: '',
        descripcion: '',
        imagen: null,
        documento: null,
      });
    } catch (error) {
      console.error('Error al añadir avance:', error);
    }
  };

  // Función para subir archivos al backend
  async function subirArchivo(formData, idProyecto, tipo) {
    const res = await axios.post(`https://backusuarios-production.up.railway.app/upload/${idProyecto}?tipo=${tipo}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }

  // Guarda el avance en Firestore usando arrayUnion para no sobrescribir los avances anteriores
  async function guardarAvanceEnFirestore(idProyecto, archivo) {
    const proyectoRef = doc(db, 'proyectos', idProyecto);
    await updateDoc(proyectoRef, {
      avances: arrayUnion({
        nombre: archivo.nombre,
        tipo: archivo.tipo,
        url: archivo.url,
        fecha: new Date().toISOString(),
        descripcion: newAdvance.descripcion,
      }),
    });
  }

  // Memoriza la lista de avances ordenados por fecha descendente
  const avancesMemo = useMemo(() => {
    const avances = project.avances || [];
    return [...avances].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [project.avances]);

  // Justo antes del return principal, determina si el proyecto está finalizado
  const isFinalizado = project.estadoActual?.estado === "Finalizado";

  // Renderizado del componente
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4 }}>
      {/* Sección de detalles del proyecto */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
          Detalles del Proyecto
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={6}>
          {/* Muestra los campos principales del proyecto */}
          {/* Título */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Título</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>{project.titulo}</Typography>
          </Grid>
          {/* Área */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Área</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>{project.area}</Typography>
          </Grid>
          {/* Objetivos */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Objetivos</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {(Array.isArray(project.objetivos) ? project.objetivos : [project.objetivos]).map((obj, i) => (
                <Paper key={i} sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: 'grey.100', mr: 1, mb: 1 }}>
                  <Typography variant="body2">{typeof obj === 'string' ? obj : JSON.stringify(obj)}</Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
          {/* Fechas */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Fecha de Inicio</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {project.fechaInicio
                ? new Date(project.fechaInicio.seconds * 1000).toLocaleDateString()
                : 'No definida'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Fecha de Finalización</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {project.fechaFinal
                ? new Date(project.fechaFinal.seconds * 1000).toLocaleDateString()
                : 'No definida'}
            </Typography>
          </Grid>
          {/* Presupuesto e institución */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Presupuesto</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>{project.presupuesto}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Institución</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>{project.institucion}</Typography>
          </Grid>
          {/* Estado y observaciones */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Estado</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {project.estadoActual?.estado || 'No definido'}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {/* <Typography variant="body2">
                Estado Actual: {project.estadoActual.estado || 'No definido'}
              </Typography> */}
              {/* <Typography variant="body2">
                Fecha: {project.estadoActual?.fecha
                  ? new Date(project.estadoActual.fecha.seconds * 1000).toLocaleDateString()
                  : 'No definida'}
              </Typography> */}
              <Typography variant="body2">
                Observación: {project.estadoActual?.observacion || 'Sin observación'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Observaciones</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>{project.observaciones}</Typography>
          </Grid>
          {/* Integrantes */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Integrantes</Typography>
            {Array.isArray(project.integrantes) && project.integrantes.length > 0 ? (
              <Box sx={{ mt: 1 }}>
                {project.integrantes.map((integrante, idx) => (
                  <Paper key={idx} sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: 'grey.100', mb: 1 }}>
                    <Typography variant="body2">
                      {integrante.nombre} {integrante.apellido} - {integrante.identificacion} ({integrante.gradoEscolar})
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No hay integrantes registrados.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Sección para añadir un nuevo avance */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600} color="primary.main">
          Añadir Avance
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {/* Campo de fecha */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Fecha"
              name="fecha"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={newAdvance.fecha}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          {/* Campo de descripción */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              multiline
              rows={2}
              value={newAdvance.descripcion}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>
          {/* Botón para subir imagen */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<PermMediaIcon />}
              sx={{ mb: 1 }}
            >
              Subir Imagen
              <input
                type="file"
                name="imagen"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {newAdvance.imagen?.nombre && (
              <Typography variant="caption" color="success.main">
                Imagen lista para subir: {newAdvance.imagen.nombre}
              </Typography>
            )}
          </Grid>
          {/* Botón para subir documento */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<InsertDriveFileIcon />}
              sx={{ mb: 1 }}
            >
              Subir Documento
              <input
                type="file"
                name="documento"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {newAdvance.documento && (
              <Typography variant="caption" color="success.main">
                Documento listo para subir: {newAdvance.documento.nombre}
              </Typography>
            )}
          </Grid>
          {/* Botón para añadir avance */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAdvance}
              sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
              fullWidth
              disabled={isFinalizado} // Deshabilita si el proyecto está finalizado
            >
              Añadir Avance
            </Button>
          </Grid>
        </Grid>
        {isFinalizado && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            No se pueden agregar avances a un proyecto finalizado.
          </Typography>
        )}
      </Paper>

      {/* Sección que muestra la lista de avances del proyecto */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }} fontWeight={600} color="primary.main">
          Avances del Proyecto
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {avancesMemo.length > 0 ? (
          <Grid container spacing={3}>
            {avancesMemo.map((avance, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Suspense fallback={<div>Cargando...</div>}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        {/* Miniatura con ícono según el tipo de archivo */}
                        {avance.tipo === 'image' ? (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 56, height: 56, bgcolor: 'grey.100', color: '#1976d2' }}
                          >
                            <PermMediaIcon fontSize="large" />
                          </Avatar>
                        ) : avance.url && avance.url.endsWith('.pdf') ? (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 56, height: 56, bgcolor: '#e53935', color: '#fff' }}
                          >
                            <PictureAsPdfIcon fontSize="large" />
                          </Avatar>
                        ) : avance.url && (avance.url.endsWith('.doc') || avance.url.endsWith('.docx')) ? (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 56, height: 56, bgcolor: '#1976d2', color: '#fff' }}
                          >
                            <DescriptionIcon fontSize="large" />
                          </Avatar>
                        ) : (
                          <Avatar
                            variant="rounded"
                            sx={{ width: 56, height: 56, bgcolor: 'grey.400', color: '#fff' }}
                          >
                            <InsertDriveFileIcon fontSize="large" />
                          </Avatar>
                        )}

                        {/* Información del avance */}
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            {avance.fecha ? new Date(avance.fecha).toLocaleDateString() : 'Sin fecha'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {avance.descripcion}
                          </Typography>
                          {/* Nombre del archivo */}
                          {avance.nombre && (
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                              {avance.nombre}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                      {/* Vista previa del archivo si existe */}
                      {avance.url && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          {avance.tipo === 'image' ? (
                            <>
                              <CardMedia
                                component="img"
                                height="180"
                                image={avance.url}
                                alt="Imagen del avance"
                                sx={{ borderRadius: 2, objectFit: 'cover', mb: 1 }}
                              />
                            </>
                          ) : avance.url.endsWith('.pdf') ? (
                            <Box sx={{ mt: 2 }}>
                              <Document file={avance.url}>
                                <Page pageNumber={1} />
                              </Document>
                              <Button
                                variant="outlined"
                                color="primary"
                                href={avance.url}
                                target="_blank"
                                startIcon={<InsertDriveFileIcon />}
                                sx={{ mt: 1 }}
                              >
                                Ver Documento
                              </Button>
                            </Box>
                          ) : (avance.url.endsWith('.doc') || avance.url.endsWith('.docx')) ? (
                            <Box sx={{ mt: 2 }}>
                              <iframe className="iframe-docx"
                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(avance.url)}`}
                                title="Visor DOCX"
                              />
                            </Box>
                          ) : (
                            <Button
                              variant="outlined"
                              color="primary"
                              href={avance.url}
                              target="_blank"
                              startIcon={<InsertDriveFileIcon />}
                              sx={{ mt: 1 }}
                            >
                              Ver Documento
                            </Button>
                          )}
                        </>
                      )}
                    </Suspense>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No hay avances registrados.</Typography>
        )}
      </Paper>
    </Box>
  );
}