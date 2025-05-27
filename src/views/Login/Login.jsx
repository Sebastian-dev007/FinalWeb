//Hook import
import { useState } from "react";

//MUI imports
import {
  Grid,
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Icon imports
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

// React Router imports
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Firebase imports
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, githubProvider, facebookProvider } from "./FirebaseConfig";

// Import de la imagen de fondo y estilos
import login from "./IMG/login.jpg";
import "./css/Login.css";


// Componente principal de Login
const Login = () => {
  // Estado para almacenar los datos del formulario de login
  const [body, setBody] = useState({ username: "", password: "" });
  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");
  // Hook para navegación programática
  const navigate = useNavigate();
  // Base URL de la API, obtenida desde variable de entorno
  const BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');

  // Maneja los cambios en los campos del formulario
  const inputChange = ({ target }) => {
    const { name, value } = target;
    setBody({
      ...body,
      [name]: value,
    });
  };

  // Envía los datos del formulario para iniciar sesión tradicional
  const onSubmit = () => {
    axios
      .post(`${BASE}/api/login`, body)
      .then(({ data }) => {
        // Guarda autenticación y rol en localStorage
        localStorage.setItem("auth", "yes");
        localStorage.setItem("rol", data.rol);

        // Redirige según el rol del usuario
        switch (data.rol) {
          case "docente":
            navigate("/projects");
            break;
          case "coordinador":
            navigate("/dashboard/default");
            break;
          case "estudiante":
            navigate("/projects");
            break;
          default:
            navigate("/");
        }
      })
      .catch(({ response }) => {
        // Manejo de errores de autenticación
        const message =
          typeof response.data === "string"
            ? response.data
            : "Error al iniciar sesión";
        setError(message);
        setBody({ username: "", password: "" });
      });
  };

  // Inicio de sesión con Google usando Firebase
  const onGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("auth", "yes");
      localStorage.setItem("googleUser", JSON.stringify(user));
      navigate("/dashboard/default");
    } catch (error) {
      console.error("Error en el inicio de sesión con Google:", error);
    }
  };

  // Inicio de sesión con GitHub usando Firebase
  const onGitHubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      localStorage.setItem("auth", "yes");
      localStorage.setItem("githubUser", JSON.stringify(user));
      navigate("/dashboard/default");
    } catch (error) {
      console.error("Error en el inicio de sesión con GitHub:", error);
    }
  };

  // Inicio de sesión con Facebook usando Firebase
  const onFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      localStorage.setItem("auth", "yes");
      localStorage.setItem("facebookUser", JSON.stringify(user));
      navigate("/dashboard/default");
    } catch (error) {
      console.error("Error en el inicio de sesión con Facebook:", error);
    }
  };

  // Hook para acceder al tema de Material UI
  const theme = useTheme();

  // Renderizado del formulario de login
  return (
    <Grid
      container
      component="main"
      className="login-root"
      style={{
        backgroundImage: `url(${login})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <Container
        component={Paper}
        elevation={6}
        maxWidth="xs"
        className="glass-card"
      >
        <div className="login-content">
          {/* Avatar con icono de candado */}
          <Avatar className="login-avatar">
            <LockOutlinedIcon />
          </Avatar>
          {/* Título del formulario */}
          <Typography component="h1" variant="h5" className="login-title">
            Iniciar Sesión
          </Typography>
          {/* Mensaje de error si existe */}
          {error && (
            <Typography
              color="error"
              align="center"
              variant="body2"
              className="error-text"
            >
              {error}
            </Typography>
          )}

          {/* Formulario de usuario y contraseña */}
          <form className="login-form">
            <TextField
              fullWidth
              autoFocus
              margin="normal"
              variant="outlined"
              label="Usuario"
              value={body.username}
              onChange={inputChange}
              name="username"
              InputProps={{ className: "text-field" }}
            />
            <TextField
              fullWidth
              type="password"
              margin="normal"
              variant="outlined"
              label="Contraseña"
              value={body.password}
              onChange={inputChange}
              name="password"
              InputProps={{ className: "text-field" }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
              onClick={onSubmit}
            >
              Ingresar
            </Button>
          </form>

          {/* Separador visual */}
          <Typography
            align="center"
            style={{ margin: "16px 0", color: "#aaa" }}
          >
            ó
          </Typography>

          {/* Botón de inicio de sesión con Google */}
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={onGoogleSignIn}
            className="google-button"
          >
            <GoogleIcon sx={{ mr: 1 }} />
            Ingresar con Google
          </Button>
          {/* Botón de inicio de sesión con GitHub */}
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={onGitHubSignIn}
            className="github-button"
          >
            <GitHubIcon sx={{ mr: 1 }} />
            Ingresar con GitHub
          </Button>
          {/* Botón de inicio de sesión con Facebook */}
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={onFacebookSignIn}
            className="facebook-button"
          >
            <FacebookIcon sx={{ mr: 1 }} />
            Ingresar con Facebook
          </Button>
        </div>
      </Container>
    </Grid>
  );
};

export default Login;
