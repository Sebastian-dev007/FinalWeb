// Importaciones principales de React y librerías
import { useState, lazy, Suspense, useMemo, useCallback } from 'react';

// Importaciones de Material UI para la interfaz y componentes de diálogo
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

// Importaciones para manejo de fechas y localización
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale/es';

// Importaciones de Material UI para diseño y utilidades
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// Iconos para acciones en la UI
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

// Importaciones de Firebase para guardar proyectos
import { db } from '../../bd/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Importa el contexto de proyectos para actualizar el estado global
import { useProjectContext } from './ProjectContext';

// Importación lenta del listado de proyectos para optimizar carga
const ProjectList = lazy(() => import('./ProjectListV1'));

// Componente principal para registrar y listar proyectos
export default function Projects() {
  // Estado para controlar la apertura del modal de registro
  const [modalOpen, setModalOpen] = useState(false);

  // Estado para los datos del formulario de registro de proyecto
  const [formData, setFormData] = useState({
    titulo: '',
    area: '',
    objetivos: [],
    fechaInicio: null,
    fechaFin: null,
    presupuesto: '',
    institucion: '',
    integrantes: [{ nombre: '', apellido: '', identificacion: '', gradoEscolar: '' }],
    observaciones: '',
    estadoActual: { estado: 'Activo' },
  });

  // Estado para el input de objetivo y edición de objetivos
  const [objetivoInput, setObjetivoInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Obtiene la función para agregar proyectos al contexto global
  const { addProject } = useProjectContext();

  // Función para agregar un objetivo al arreglo de objetivos
  const addObjetivo = () => {
    if (objetivoInput.trim() !== '') {
      setFormData({
        ...formData,
        objetivos: [...formData.objetivos, objetivoInput.trim()],
      });
      setObjetivoInput('');
    }
  };

  // Función para eliminar un objetivo por su índice
  const removeObjetivo = (index) => {
    setFormData({
      ...formData,
      objetivos: formData.objetivos.filter((_, i) => i !== index),
    });
  };

  // Inicia la edición de un objetivo
  const startEditObjetivo = (idx) => {
    setEditIndex(idx);
    setEditValue(formData.objetivos[idx]);
  };

  // Guarda la edición de un objetivo
  const saveEditObjetivo = (idx) => {
    const nuevos = [...formData.objetivos];
    nuevos[idx] = editValue.trim();
    setFormData({ ...formData, objetivos: nuevos });
    setEditIndex(null);
    setEditValue('');
  };

  // Cancela la edición de un objetivo
  const cancelEditObjetivo = () => {
    setEditIndex(null);
    setEditValue('');
  };

  // Maneja los cambios en los campos del formulario principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja los cambios en los campos de fecha
  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Maneja los cambios en los campos de cada integrante del equipo
  const handleIntegranteChange = useCallback((index, field, value) => {
    const updatedIntegrantes = [...formData.integrantes];
    updatedIntegrantes[index][field] = value;
    setFormData(prev => ({ ...prev, integrantes: updatedIntegrantes }));
  }, [formData.integrantes]);

  // Agrega un nuevo integrante vacío al arreglo
  const addIntegrante = () => {
    setFormData({
      ...formData,
      integrantes: [...formData.integrantes, { nombre: '', apellido: '', identificacion: '', gradoEscolar: '' }],
    });
  };

  // Elimina un integrante por su índice
  const removeIntegrante = (index) => {
    const updatedIntegrantes = formData.integrantes.filter((_, i) => i !== index);
    setFormData({ ...formData, integrantes: updatedIntegrantes });
  };

  // Función para validar que todos los campos obligatorios estén llenos
  const isFormValid = () => {
    // Validar campos principales
    if (
      !formData.titulo.trim() ||
      !formData.area.trim() ||
      formData.objetivos.length === 0 ||
      !formData.fechaInicio ||
      !formData.presupuesto.trim() ||
      !formData.institucion.trim() ||
      !formData.observaciones.trim() || 
      formData.integrantes.length === 0 ||
      formData.integrantes.some(
        (i) =>
          !i.nombre.trim() ||
          !i.apellido.trim() ||
          !i.identificacion.trim() ||
          !i.gradoEscolar.trim()
      )
    ) {
      return false;
    }
    return true;
  };

  // Envía el formulario para registrar el proyecto en Firestore y contexto global
  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert('Por favor, completa todos los campos obligatorios antes de registrar el proyecto.');
      return;
    }
    try {
      // Prepara los datos para enviar a Firestore
      const dataToSend = {
        ...formData,
        fechaInicio: formData.fechaInicio ? Timestamp.fromDate(new Date(formData.fechaInicio)) : null,
        fechaFin: formData.fechaFin ? Timestamp.fromDate(new Date(formData.fechaFin)) : null,
        objetivos: Array.isArray(formData.objetivos) ? formData.objetivos : [],
        integrantes: Array.isArray(formData.integrantes) ? formData.integrantes : [],
      };
      // Guarda el proyecto en Firestore
      const docRef = await addDoc(collection(db, 'proyectos'), formData);
      // Agrega el proyecto al contexto global
      addProject({ id: docRef.id, ...dataToSend });
      // Cierra el modal y limpia el formulario
      setModalOpen(false);
      setFormData({
        titulo: '',
        area: '',
        objetivos: [],
        fechaInicio: null,
        fechaFin: null,
        presupuesto: '',
        institucion: '',
        integrantes: [{ nombre: '', apellido: '', identificacion: '', gradoEscolar: '' }],
        observaciones: '',
        estadoActual: { estado: 'Activo' },
      });
      setObjetivoInput('');
    } catch (error) {
      console.error('Error al registrar el proyecto:', error);
    }
  };

  // Memoriza la lista de integrantes para evitar renders innecesarios y mejorar el rendimiento
  const memoizedIntegrantes = useMemo(() =>
    formData.integrantes.map((integrante, index) => (
      <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Nombre"
            value={integrante.nombre}
            onChange={(e) => handleIntegranteChange(index, 'nombre', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Apellido"
            value={integrante.apellido}
            onChange={(e) => handleIntegranteChange(index, 'apellido', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Identificación"
            value={integrante.identificacion}
            onChange={(e) => handleIntegranteChange(index, 'identificacion', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={10} sm={5} md={2}>
          <TextField
            fullWidth
            label="Grado Escolar"
            value={integrante.gradoEscolar}
            onChange={(e) => handleIntegranteChange(index, 'gradoEscolar', e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={2} sm={1} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button color="secondary" onClick={() => removeIntegrante(index)}>
            Eliminar
          </Button>
        </Grid>
      </Grid>
    )), [formData.integrantes, handleIntegranteChange]);

  // Renderizado principal del componente
  return (
    <Box sx={{ padding: { xs: 1, sm: 3 }, bgcolor: '#f7f9fb', minHeight: '100vh' }}>
      {/* Encabezado y botón para abrir el modal de registro */}
      <Box
        sx={{
          marginBottom: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Gestión de Proyectos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2, fontWeight: 600, boxShadow: 2 }}
        >
          Registrar Proyecto
        </Button>
      </Box>

      {/* Modal de registro de proyecto */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 4, bgcolor: '#fff', boxShadow: 8 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', fontSize: 28 }}>
          Registrar Proyecto
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          {/* Formulario de registro con secciones */}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
            <Grid container spacing={3} sx={{ px: { xs: 1, sm: 3, md: 6 }, py: { xs: 1, sm: 2 } }}>
              {/* Información general */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Información General
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Título"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Área"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}
                />
              </Grid>

              {/* Objetivos */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Objetivos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {/* Input y botones para agregar/editar objetivos */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' }, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Nuevo objetivo"
                    value={objetivoInput}
                    onChange={(e) => setObjetivoInput(e.target.value)}
                    variant="outlined"
                    sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}
                  />
                  <Button variant="contained" onClick={addObjetivo} sx={{ borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}>
                    Agregar
                  </Button>
                </Box>
                {/* Lista de objetivos con opciones de editar y eliminar */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.objetivos.map((obj, idobjetivo) =>
                    editIndex === idobjetivo ? (
                      <Box key={`edit-${idobjetivo}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size="small"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                        <IconButton color="primary" onClick={() => saveEditObjetivo(idobjetivo)}>
                          <DoneIcon />
                        </IconButton>
                        <IconButton color="error" onClick={cancelEditObjetivo}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Chip
                        key={`objetivo-${idobjetivo}`}
                        label={String(obj)}
                        onDelete={() => removeObjetivo(idobjetivo)}
                        deleteIcon={<CloseIcon />}
                        sx={{ fontSize: 16, bgcolor: '#e3f2fd', color: 'primary.main' }}
                        clickable
                        onClick={() => startEditObjetivo(idobjetivo)}
                        icon={<EditIcon />}
                        variant="outlined"
                      />
                    )
                  )}
                </Box>
              </Grid>

              {/* Fechas */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Fechas
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Suspense fallback={<CircularProgress />}>
                  <DatePicker
                    label="Fecha de Inicio"
                    value={formData.fechaInicio}
                    onChange={(value) => handleDateChange('fechaInicio', value)}
                    minDate={new Date()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="outlined" sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }} />
                    )}
                  />
                </Suspense>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Suspense fallback={<CircularProgress />}>
                  <DatePicker
                    label="Fecha de Finalización (opcional)"
                    value={formData.fechaFin}
                    onChange={(value) => handleDateChange('fechaFin', value)}
                    minDate={new Date()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="outlined" sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }} />
                    )}
                  />
                </Suspense>
              </Grid>

              {/* Presupuesto e Institución */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Presupuesto e Institución
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Presupuesto"
                  name="presupuesto"
                  value={formData.presupuesto}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institución"
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}
                />
              </Grid>

              {/* Integrantes del equipo */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Integrantes del equipo
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {memoizedIntegrantes}
                <Button onClick={addIntegrante} variant="outlined" sx={{ mt: 1, borderRadius: 2 }}>
                  Agregar Integrante
                </Button>
              </Grid>

              {/* Observaciones */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Observaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  multiline
                  minRows={5}
                  maxRows={10}
                  variant="outlined"
                  sx={{
                    bgcolor: '#f5f7fa',
                    borderRadius: 2,
                    fontSize: { xs: 14, sm: 16 },
                  }}
                  slotProps={{
                    input: {
                      sx: {
                        fontSize: { xs: 14, sm: 16 },
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        {/* Botones de acción del modal */}
        <DialogActions sx={{ bgcolor: '#f7f9fb', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <Button onClick={() => setModalOpen(false)} color="secondary" sx={{ borderRadius: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Listado de proyectos, cargado de forma perezosa */}
      <Suspense fallback={<CircularProgress />}>
        <Box sx={{ marginTop: 4 }}>
          <ProjectList />
        </Box>
      </Suspense>
    </Box>
  );
}