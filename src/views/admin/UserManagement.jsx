import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    TextField, Button, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText, IconButton,
    Paper, Typography, Grid, Box, Divider, Stack, Avatar
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'


const UserManagement = () => {
    const [usuarios, setUsuarios] = useState([])
    const [form, setForm] = useState({ nombre_usuario: '', contrasena_usuario: '', rol: 'estudiante' })
    const [modoEdicion, setModoEdicion] = useState(false)
    const [idEditando, setIdEditando] = useState(null)

    const BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');


    const fetchUsuarios = () => {
        axios.get(`${BASE}/api/usuarios`).then(({ data }) => setUsuarios(data))
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const handleSubmit = () => {
        if (modoEdicion) {
            axios.put(`${BASE}/api/usuarios/${idEditando}`, form).then(() => {
                resetForm()
                fetchUsuarios()
            })
        } else {
            axios.post(`${BASE}/api/usuarios`, form).then(() => {
                resetForm()
                fetchUsuarios()
            })
        }
    }

    const handleDelete = (id) => {
        axios.delete(`${BASE}/api/usuarios/${id}`).then(fetchUsuarios)
    }

    const handleEdit = (usuario) => {
        setForm({
            nombre_usuario: usuario.nombre_usuario,
            contrasena_usuario: '',
            rol: usuario.rol
        })
        setModoEdicion(true)
        setIdEditando(usuario.id)
    }

    const resetForm = () => {
        setForm({ nombre_usuario: '', contrasena_usuario: '', rol: 'estudiante' })
        setModoEdicion(false)
        setIdEditando(null)
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
            <Paper elevation={4} sx={{ p: { xs: 1, sm: 4 }, borderRadius: 3, mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                    Gestión de Usuarios
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Usuario"
                                value={form.nombre_usuario}
                                onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })}
                                fullWidth
                                autoFocus
                                margin="dense"
                                required={!modoEdicion}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Contraseña"
                                value={form.contrasena_usuario}
                                onChange={(e) => setForm({ ...form, contrasena_usuario: e.target.value })}
                                fullWidth
                                type="password"
                                margin="dense"
                                required={!modoEdicion}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    value={form.rol}
                                    label="Rol"
                                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                                >
                                    <MenuItem value="">Seleccione</MenuItem>
                                    <MenuItem value="estudiante">Estudiante</MenuItem>
                                    <MenuItem value="docente">Docente</MenuItem>
                                    <MenuItem value="coordinador">Coordinador</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', mt: { xs: 0, sm: 2 } }}>
                            <Stack direction="row" spacing={2} sx={{ width: '100%',alignItems:'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    sx={{ fontWeight: 600, width: '100%',alignItems:'center'  }}
                                >
                                    {modoEdicion ? 'Actualizar' : 'Crear'}
                                </Button>
                                {modoEdicion && (
                                    <Button
                                        onClick={resetForm}
                                        color="secondary"
                                        variant="outlined"
                                        fullWidth
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={600} color="primary.main" gutterBottom>
                    Lista de Usuarios
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                    {usuarios.map(u => (
                        <ListItem
                            key={u.id}
                            sx={{
                                bgcolor: 'grey.50',
                                borderRadius: 2,
                                mb: 1,
                                boxShadow: 1,
                                '&:hover': { boxShadow: 3, bgcolor: 'grey.100' },
                                transition: 'all 0.2s'
                            }}
                            secondaryAction={
                                <Stack direction="row" spacing={1}>
                                    <IconButton edge="end" color="primary" onClick={() => handleEdit(u)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" color="error" onClick={() => handleDelete(u.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            }
                        >
                            <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                <PersonIcon />
                            </Avatar>
                            <ListItemText
                                primary={
                                    <Typography fontWeight={600}>{u.nombre_usuario}</Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        Rol: {u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    )
}

export default UserManagement
