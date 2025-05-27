# Sistema de Gestión de Proyectos de Investigación

Este proyecto es una aplicación web desarrollada con React, Material UI y Firebase, diseñada para la gestión integral de proyectos de investigación académica. Permite a docentes, coordinadores y estudiantes registrar, visualizar, editar y administrar proyectos, así como gestionar usuarios y avances de los mismos.

---

## 🚀 Características principales

- **Registro y edición de proyectos:**  
  Permite crear nuevos proyectos, agregar objetivos, integrantes, fechas, presupuesto, institución y observaciones.

  ![Vista principal del frontend](assets/images/readme/projects.png)
  ![Formulario para agregar proyectos](assets/images/readme/projectsAdd.png)
  ![Formulario para editar un proyecto](assets/images/readme/projectEdit.png)

- **Gestión de usuarios:**  
  Los coordinadores pueden crear, editar y eliminar usuarios del sistema.
![Formulario para agregar usuarios](assets/images/readme/userCreate.png)
![Lista de usuarios](assets/images/readme/userList.png)
![Edicion de usuario](assets/images/readme/userEdit.png)

- **Control de estados:**  
  Los proyectos pueden cambiar de estado (Formulación, Evaluación, Activo, Inactivo, Finalizado) y se mantiene un historial de cambios.

![Edicion de estado](assets/images/readme/state.png)
![Historial de estado](assets/images/readme/stateSave.png)

- **Gestión de avances:**  
  Se pueden registrar avances de los proyectos, incluyendo la subida de archivos (imágenes, PDF, Word).

![Formulario para agregar avances del proyecto](assets/images/readme/advanced.png)
![Registro de avances del proyecto](assets/images/readme/advancedR.png)

- **Filtros y búsqueda:**  
  Listados de proyectos con filtros por título, institución, área y docente.

![Filtro de busqueda de los proyectos](assets/images/readme/filter.png)

- **Exportación de reportes:**  
  Generación de reportes en PDF de los proyectos registrados.

- **Autenticación:**  
  Inicio de sesión tradicional y con Google.

  ![Formulario de inicio de sesion](assets/images/readme/login.png)

---

## 🗂️ Estructura del proyecto

```
src/
  ├── api/
  ├── assets/
  ├── bd/
  ├── components/
  ├── contexts/
  ├── hooks/
  ├── layout/
  ├── themes/
  ├── views/
  │    ├── Home/
  │    ├── Login/
  │    ├── admin/
  │    └── projects/
  ├── App.jsx
  └── index.jsx
```

---

## ⚙️ Instalación

1. **Clona el repositorio:**
   ```sh
   git clone <url-del-repositorio>
   cd <nombre-del-proyecto>
   ```

2. **Instala las dependencias:**
   ```sh
   npm i
   ```

3. **Configura las variables de entorno:**  
   Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales de Firebase, Cloudinary y la URL de la API backend. Ejemplo:
   ```
   VITE_API_URL=https://backusuarios-production.up.railway.app
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

---

## 🖥️ Scripts disponibles

- `npm start`  
  Inicia la aplicación en modo desarrollo.

- `npm build`  
  Genera la versión de producción.

- `npm test`  
  Ejecuta los tests.

---

## 🛠️ Tecnologías utilizadas

- **React**  
- **Material UI**  
- **Firebase (Firestore)**  
- **Vite**  
- **Axios**  
- **jsPDF**  
- **React Router**  

---

## 👥 Roles y permisos

- **Docente:**  
  Puede registrar y gestionar sus propios proyectos.

- **Coordinador:**  
  Administra usuarios y tiene acceso a todos los proyectos.

- **Estudiante:**  
  Visualiza y agrega avances a los proyectos en los que participa.

---

## 🤝 Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

> Para dudas o sugerencias, contactanos

