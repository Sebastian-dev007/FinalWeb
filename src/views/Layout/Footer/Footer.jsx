import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import '../../css/Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <Container maxWidth="sm">
                <Typography align="center">
                    Sebastian y Juan © {new Date().getFullYear()}
                </Typography>
            </Container>
        </footer>
    )
}

export default Footer
