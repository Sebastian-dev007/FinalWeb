import React, { useState, lazy, Suspense, useMemo, useCallback } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale/es';
import { db } from '../../bd/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useProjectContext } from './ProjectContext';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Timestamp } from 'firebase/firestore';
import { DatePicker } from '@mui/x-date-pickers';
const ProjectList = lazy(() => import('./ProjectListV1'));

export default function Projects() {
  const [modalOpen, setModalOpen] = useState(false);
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
    estadoActual:{estado:'Activo'},
  });
  const [objetivoInput, setObjetivoInput] = useState(''); // Para el input de objetivo
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { addProject } = useProjectContext();

  // Agregar objetivo al arreglo
  const addObjetivo = () => {
    if (objetivoInput.trim() !== '') {
      setFormData({
        ...formData,
        objetivos: [...formData.objetivos, objetivoInput.trim()],
      });
      setObjetivoInput('');
    }
  };

  // Eliminar objetivo del arreglo
  const removeObjetivo = (index) => {
    setFormData({
      ...formData,
      objetivos: formData.objetivos.filter((_, i) => i !== index),
    });
  };

  // Iniciar edición
  const startEditObjetivo = (idx) => {
    setEditIndex(idx);
    setEditValue(formData.objetivos[idx]);
  };

  // Guardar edición
  const saveEditObjetivo = (idx) => {
    const nuevos = [...formData.objetivos];
    nuevos[idx] = editValue.trim();
    setFormData({ ...formData, objetivos: nuevos });
    setEditIndex(null);
    setEditValue('');
  };

  // Cancelar edición
  const cancelEditObjetivo = () => {
    setEditIndex(null);
    setEditValue('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleIntegranteChange = useCallback((index, field, value) => {
    const updatedIntegrantes = [...formData.integrantes];
    updatedIntegrantes[index][field] = value;
    setFormData(prev => ({ ...prev, integrantes: updatedIntegrantes }));
  }, [formData.integrantes]);

  const addIntegrante = () => {
    setFormData({
      ...formData,
      integrantes: [...formData.integrantes, { nombre: '', apellido: '', identificacion: '', gradoEscolar: '' }],
    });
  };

  const removeIntegrante = (index) => {
    const updatedIntegrantes = formData.integrantes.filter((_, i) => i !== index);
    setFormData({ ...formData, integrantes: updatedIntegrantes });
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        fechaInicio: formData.fechaInicio ? Timestamp.fromDate(new Date(formData.fechaInicio)) : null,
        fechaFin: formData.fechaFin ? Timestamp.fromDate(new Date(formData.fechaFin)) : null,
        objetivos: Array.isArray(formData.objetivos) ? formData.objetivos : [],
        integrantes: Array.isArray(formData.integrantes) ? formData.integrantes : [],
      };
      const docRef = await addDoc(collection(db, 'proyectos'), formData);
      addProject({ id: docRef.id, ...dataToSend });
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
        estadoActual:{estado:'Activo'},
      });
      setObjetivoInput('');
    } catch (error) {
      console.error('Error al registrar el proyecto:', error);
    }
  };

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

  return (
    <Box sx={{ padding: { xs: 1, sm: 3 }, bgcolor: '#f7f9fb', minHeight: '100vh' }}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
            <Grid container spacing={3} sx={{ px: { xs: 1, sm: 3, md: 6 }, py: { xs: 1, sm: 2 } }}>
              {/* Sección: Información general */}
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

              {/* Sección: Objetivos */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  Objetivos
                </Typography>
                <Divider sx={{ mb: 2 }} />
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

              {/* Sección: Fechas */}
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

              {/* Sección: Presupuesto e Institución */}
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

              {/* Sección: Integrantes */}
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

              {/* Sección: Observaciones */}
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
        <DialogActions sx={{ bgcolor: '#f7f9fb', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <Button onClick={() => setModalOpen(false)} color="secondary" sx={{ borderRadius: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Suspense fallback={<CircularProgress />}>
        <Box sx={{ marginTop: 4 }}>
          <ProjectList />
        </Box>
      </Suspense>
    </Box>
  );
}


