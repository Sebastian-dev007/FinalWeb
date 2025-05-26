import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import '../../../css/Header.css'

const Header = ({ setOpen }) => {
    const navigate = useNavigate()

    return (
        <AppBar color="secondary" position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setOpen(true)}
                    className="menuButton"
                >
                    <MenuIcon />
                </IconButton>
                <Typography className="title">Gestión de Proyectos</Typography>
                <Button
                    variant="text"
                    color="inherit"
                    onClick={() => {
                        localStorage.clear()
                        navigate('/login')
                    }}
                >
                Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header
