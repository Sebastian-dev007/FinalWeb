import { useState } from "react";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, githubProvider, facebookProvider } from "./FirebaseConfig";
// import fondo from './fondo.jpg'
import login from "./IMG/login.jpg";
import "./css/Login.css";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
// const providers = [
//   { id: "github", name: "GitHub" },
//   { id: "google", name: "Google" },
//   { id: "facebook", name: "Facebook" },
//   { id: "twitter", name: "Twitter" },
//   { id: "linkedin", name: "LinkedIn" },
// ];
// const signIn = async (provider) => {
//   // preview-start
//   const promise = new Promise((resolve) => {
//     setTimeout(() => {
//       console.log(`Sign in with ${provider.id}`);
//       resolve({ error: "This is a fake error" });
//     }, 500);
//   });
//   // preview-end
//   return promise;
// };

const Login = () => {
  const [body, setBody] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
 const BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');

  const inputChange = ({ target }) => {
    const { name, value } = target;

    setBody({
      ...body,
      [name]: value,
    });
  };

  const onSubmit = () => {
    axios
      .post(`${BASE}/api/login`, body)
      .then(({ data }) => {
        localStorage.setItem("auth", "yes");
        localStorage.setItem("rol", data.rol);

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
        const message =
          typeof response.data === "string"
            ? response.data
            : "Error al iniciar sesión";
        setError(message);
        setBody({ username: "", password: "" });
      });
  };
  //Inicio de sesión con Google
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

  //Inicio de sesión con GitHub
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

  //Inicio de sesión con Facebook
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
  const theme = useTheme();
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
          <Avatar className="login-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="login-title">
            Iniciar Sesión
          </Typography>
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

          <Typography
            align="center"
            style={{ margin: "16px 0", color: "#aaa" }}
          >
            ó
          </Typography>

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
