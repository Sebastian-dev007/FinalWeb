import React from 'react'
import Drawer from '@mui/material/Drawer'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from '../icon.jpg'
import '../../css/MainMenu.css'

const MainMenu = ({ open, setOpen }) => {
    return (
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
            <Paper className="mainMenu-paper" elevation={0}>
                <div className="mainMenu-header">
                    <IconButton edge="start" color="inherit" onClick={() => setOpen(false)}>
                        <MenuIcon />
                    </IconButton>
                    <img src={Logo} alt="Logo" className="mainMenu-logo" />
                </div>
                <Divider />
            </Paper>
        </Drawer>
    )
}

export default MainMenu
