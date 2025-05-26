import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../views/css/errorpage.css';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const auth = localStorage.getItem('auth');
    const role = localStorage.getItem('rol');

    if (auth === 'yes') {
      switch (role) {
        case 'coordinador':
          navigate('/dashboard/default');
          break;
        case 'docente':
        case 'estudiante':
          navigate('/projects');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Box className="error-page">
      <Container maxWidth="sm">
        <Box className="error-icon">
          <ErrorOutlineIcon className="icon" />
          <Typography variant="h1" className="error-code">
            404
          </Typography>
        </Box>
        <Typography variant="h5" className="error-title">
          ¡Oops! Página no encontrada
        </Typography>
        <Typography variant="body1" className="error-message">
          Lo sentimos, la página que estás buscando no existe
        </Typography>
        <Button
          variant="contained"
          className="back-button"
          onClick={handleGoHome}
        >
          Volver
        </Button>
      </Container>
    </Box>
  );
};

export default ErrorPage;
