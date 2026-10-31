# Mueblería Hermanos Jota - E-commerce

E-commerce desarrollado como proyecto grupal, enfocado en construir una experiencia de compra interactiva para una mueblería.

## 📅 Información del proyecto

* **Equipo:** Grupo E
* **Entrega:** Sprint 5 y Sprint 6
* **Tipo de proyecto:** E-commerce

## 👥 Integrantes

* Juan Ignacio Sotomayor
* Mariel Gutiérrez
* Marcos Gabriel Sánchez Matus
* Araceli Virginia Mendoza 
* Florencia Mainoli

## 📖 Descripción del proyecto

Aplicación web full stack para la Mueblería Hermanos Jota. Una API en **Express** conectada a **MongoDB Atlas** mediante **Mongoose** guarda los productos de forma permanente, y un frontend en **React** permite consultarlos, crearlos, editarlos y eliminarlos.
 
## 🌐 Enlaces
 
| Recurso | Enlace |
| --- | --- |
| Frontend (Vercel / Netlify) | `[COMPLETAR]` |
| Backend (Render) | `[COMPLETAR]` |
| Repositorio | `[COMPLETAR]` |
 
> El backend en Render (plan gratuito) puede tardar unos segundos en responder la primera vez.
 
## 🧱 Arquitectura y tecnologías
 
```
React (client)  ⇄  Express API (backend)  ⇄  MongoDB Atlas
```
 
React no se conecta a la base de datos: hace peticiones HTTP a Express, y Express usa Mongoose para leer o modificar MongoDB.
 
- **Frontend:** React, Vite, React Router DOM (`useParams`, `useNavigate`)
- **Backend:** Node.js, Express, Mongoose, dotenv, cors
- **Base de datos:** MongoDB Atlas
- **Despliegue:** Render (backend) y Vercel / Netlify (frontend)
## 📁 Estructura
 
```
├── client/     # React: components, pages, services/productService.js
├── backend/    # Express: config/db.js, models/Product.js, controllers, routes, app.js, server.js
└── README.md
```
 
## 🔌 API REST
 
**Modelo `Product`:** `nombre` (String, obligatorio), `descripcion` (String), `precio` (Number, obligatorio), `stock` (Number), `imagenUrl` (String). MongoDB agrega el `_id`.
 
| Método | Endpoint | Descripción | Éxito |
| --- | --- | --- | --- |
| GET | `/api/productos` | Todos los productos | `200` |
| GET | `/api/productos/:id` | Un producto por `_id` | `200` |
| POST | `/api/productos` | Crea un producto | `201` |
| PUT | `/api/productos/:id` | Actualiza un producto | `200` |
| DELETE | `/api/productos/:id` | Elimina un producto | `200` |
 
Los errores se devuelven como `{ "message": "..." }`: `400` (datos o `id` inválidos), `404` (producto o ruta inexistente) y `500` (error del servidor).
 
## 🖥️ Rutas del frontend
 
| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/productos` | Catálogo (datos de la API) |
| `/productos/:id` | Detalle (`useParams`) |
| `/contacto` | Formulario de contacto |
| `/admin/crear-producto` | Alta de producto |
 
Desde la interfaz se pueden crear, editar y eliminar productos (con confirmación previa). Tras cada acción se navega con `useNavigate` y se muestran mensajes de éxito o error.
 
## ⚙️ Instalación local
 
Requisitos: Node.js 18+ y una cuenta de MongoDB Atlas.
 
```bash
git clone [COMPLETAR: URL del repositorio]
cd muebleria-hermanos-jota
 
# Backend
cd backend
npm install
cp .env.example .env    # completar los valores
npm run dev             # http://localhost:4000
 
# Frontend (en otra terminal)
cd client
npm install
cp .env.example .env    # completar los valores
npm run dev             # http://localhost:5173
```
 
## 🔐 Variables de entorno
 
> Nunca se suben a GitHub el `.env` real ni las credenciales. Solo se versionan los `.env.example`.
 
**Backend (`backend/.env`)**
 
| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto de Express | `4000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB Atlas | `mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>` |
| `CLIENT_URL` | URL del frontend permitida por CORS | `http://localhost:5173` |
 
**Frontend (`client/.env`)**
 
| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` |
 
**En producción:** en Render configurar `MONGODB_URI` y `CLIENT_URL` (URL del frontend desplegado); en Vercel / Netlify configurar `VITE_API_URL` con la URL del backend (`https://<tu-backend>.onrender.com/api`). En MongoDB Atlas hay que permitir el acceso de red desde Render.
