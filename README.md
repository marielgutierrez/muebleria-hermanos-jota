# Mueblería Hermanos Jota - E-commerce

E-commerce desarrollado como proyecto grupal, enfocado en construir una experiencia de compra interactiva para una mueblería.

## 📅 Información del proyecto

* **Equipo:** Grupo E
* **Entrega:** Sprint 5 y Sprint 6
* **Tipo de proyecto:** E-commerce

## 👥 Integrantes

* Juan Ignacio Sotomayor
* Mariel Gutiérrez
* Araceli Virginia Mendoza 
* Florencia Mainoli

## 📖 Descripción del proyecto

Aplicación web full stack para la Mueblería Hermanos Jota. Una API en **Express** conectada a **MongoDB Atlas** mediante **Mongoose** guarda los productos de forma permanente, y un frontend en **React** permite consultarlos, crearlos, editarlos y eliminarlos.
 
## 🌐 Enlaces
 
| Recurso | Enlace |
| --- | --- |
| Frontend (Netlify) | [https://hermanos-jota-store.netlify.app/](https://hermanos-jota-store.netlify.app/) |
| Backend (Render) | [https://muebleria-hermanos-jota-8oe4.onrender.com/](https://muebleria-hermanos-jota-8oe4.onrender.com/) |
| Repositorio | [https://github.com/marielgutierrez/muebleria-hermanos-jota](https://github.com/marielgutierrez/muebleria-hermanos-jota) |
 
> El backend en Render (plan gratuito) puede tardar unos 40 segundos en responder la primera vez mientras se reactiva (*cold start*).
 
## 🧱 Arquitectura y tecnologías
 
```
React (client)  ⇄  Express API (backend)  ⇄  MongoDB Atlas
```
 
React no se conecta a la base de datos: hace peticiones HTTP a Express mediante `client/src/services/productService.js` (o `src/services/productService.js`), y Express usa Mongoose para leer o modificar MongoDB.
 
- **Frontend:** React 19, Vite, React Router DOM (`useParams`, `useNavigate`)
- **Backend:** Node.js, Express 5, Mongoose 9, dotenv, cors
- **Base de datos:** MongoDB Atlas
- **Despliegue:** Render (backend) y Netlify (frontend)

## 📁 Estructura
 
```
├── client/           # Servicios y clientes: src/services/productService.js
├── src/              # React: components, pages, routes, services/productService.js
├── backend/          # Express: config/db.js, models/Product.js, controllers, routes, tests, app.js, server.js
├── public/           # Assets estáticos y _redirects (para SPA en Netlify)
├── netlify.toml      # Configuración de build y redirecciones de Netlify
├── render.yaml       # Blueprint de infraestructura como código para Render
└── README.md
```
 
## 🔌 API REST
 
**Modelo `Product`:** `name` / `nombre` (String, obligatorio), `category` / `categoria` (String), `material` (String), `price` / `precio` (Number, obligatorio), `stock` (Number), `measurements` / `medidas` (String), `imageUrl` / `imagenUrl` (String). MongoDB agrega el `_id`.
 
| Método | Endpoint | Descripción | Éxito |
| --- | --- | --- | --- |
| GET | `/api/productos` o `/api/products` | Todos los productos | `200` |
| GET | `/api/productos/:id` o `/api/products/:id` | Un producto por `_id` o `id` | `200` |
| POST | `/api/productos` o `/api/products` | Crea un producto | `201` |
| PUT | `/api/productos/:id` o `/api/products/:id` | Actualiza un producto | `200` |
| DELETE | `/api/productos/:id` o `/api/products/:id` | Elimina un producto | `200` |
| GET | `/api/health` o `/health` o `/` | Health check de la API | `200` |
 
Los errores se devuelven en formato JSON `{ "message": "...", "error": "..." }`: `400` (datos inválidos), `404` (no encontrado) y `500` (error interno).
 
## 🖥️ Rutas del frontend
 
| Ruta | Página |
| --- | --- |
| `/` | Inicio (productos destacados y hero) |
| `/productos` | Catálogo completo (datos de la API) |
| `/productos/:id` | Detalle del producto |
| `/contacto` | Formulario de contacto |
| `/admin` o `/admin/productos` | Panel de gestión y listado CRUD |
| `/admin/crear-producto` | Alta de nuevo producto |
| `/admin/editar-producto/:id` | Edición de producto existente |
 
## 🧪 Pruebas de Integración del CRUD
 
El backend cuenta con una suite completa de pruebas de integración con `node:test` que valida todas las operaciones CRUD, control de errores y cabeceras CORS:
 
```bash
# Ejecutar pruebas desde la raíz:
npm test

# O desde la carpeta backend:
cd backend
npm test
```
 
## ⚙️ Instalación y ejecución local
 
Requisitos: Node.js 18+ y MongoDB local o cuenta en MongoDB Atlas.
 
```bash
git clone https://github.com/marielgutierrez/muebleria-hermanos-jota.git
cd muebleria-hermanos-jota
 
# 1. Backend
cd backend
npm install
cp .env.example .env    # configurar MONGODB_URI y PORT=4000
npm run dev             # Servidor escuchando en http://localhost:4000
 
# 2. Frontend (en otra terminal, desde la raíz del proyecto)
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:4000/api
npm run dev             # Aplicación en http://localhost:5173
```
 
## 🔐 Variables de entorno
 
> Nunca se suben a GitHub el `.env` real ni las credenciales. Solo se versionan los `.env.example`.
 
**Backend (`backend/.env`)**
 
| Variable | Descripción | Ejemplo local | Ejemplo producción |
| --- | --- | --- | --- |
| `PORT` | Puerto de Express | `4000` | `4000` (o asignado por Render) |
| `MONGODB_URI` | Conexión a MongoDB | `mongodb://127.0.0.1:27017/hermanos-jota-dev` | `mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/hermanos-jota` |
| `CLIENT_URL` | Frontend permitido en CORS | `http://localhost:5173` | `https://hermanos-jota-store.netlify.app` |
 
**Frontend (`.env` o variables de Netlify / Vercel)**
 
| Variable | Descripción | Ejemplo local | Ejemplo producción |
| --- | --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` | `https://<tu-backend-en-render>.onrender.com/api` |
 
## 🚀 Guía de Despliegue en Producción
 
### 1. Despliegue del Backend en Render
 
1. Ingresá a [Render Dashboard](https://dashboard.render.com/) y seleccioná **New > Web Service**.
2. Conectá el repositorio de GitHub `muebleria-hermanos-jota`.
3. Configurá los siguientes campos:
   - **Name:** `muebleria-hermanos-jota-backend` (o el de tu preferencia).
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. En **Environment Variables**, agregá:
   - `MONGODB_URI`: Tu cadena de conexión de MongoDB Atlas (asegurate de permitir `0.0.0.0/0` en Network Access de MongoDB Atlas).
   - `CLIENT_URL`: `https://hermanos-jota-store.netlify.app`
   - `NODE_ENV`: `production`
5. Hacé clic en **Create Web Service**.
6. Una vez desplegado, copiá la URL generada por Render (por ejemplo: `https://muebleria-hermanos-jota-backend.onrender.com`).
 
### 2. Configuración del Frontend en Netlify
 
1. Ingresá a tu panel de [Netlify](https://app.netlify.com/).
2. Entrá en el sitio correspondiente a `https://hermanos-jota-store.netlify.app/`.
3. Dirigite a **Site configuration > Environment variables**.
4. Creá o editá la variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://<tu-backend-en-render>.onrender.com/api` *(la URL de tu servicio en Render copiada en el paso anterior)*.
5. Andá a la pestaña **Deploys** y seleccioná **Trigger deploy > Clear cache and deploy site**.
6. ¡Listo! El frontend compilará con la URL de producción y se conectará directamente a la API de Render.
