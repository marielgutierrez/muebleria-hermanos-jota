# Mueblería Hermanos Jota - E-commerce

E-commerce desarrollado como proyecto grupal, enfocado en construir una experiencia de compra interactiva para una mueblería.

## 📅 Información del proyecto

* **Equipo:** Grupo E
* **Entrega:** Sprint 5, Sprint 6, Sprint 7 y Sprint 8
* **Tipo de proyecto:** E-commerce Full Stack

## 👥 Integrantes

* Juan Ignacio Sotomayor
* Mariel Gutiérrez
* Marcos Gabriel Sánchez Matus
* Araceli Virginia Mendoza 
* Florencia Mainoli

## 📖 Descripción del proyecto

Aplicación web full stack para la Mueblería Hermanos Jota. Una API en **Express** conectada a **MongoDB Atlas** mediante **Mongoose** gestiona productos, autenticación con **JWT** y gestión de pedidos de compra en el backend, y un frontend en **React** permite explorarlos, agregarlos al carrito y realizar pedidos.
 
## 🌐 Enlaces
 
| Recurso | Enlace |
| --- | --- |
| Frontend (Netlify) | [https://hermanos-jota-store.netlify.app/](https://hermanos-jota-store.netlify.app/) |
| Backend (Render) | `https://<tu-backend-en-render>.onrender.com` |
| Repositorio | [https://github.com/marielgutierrez/muebleria-hermanos-jota](https://github.com/marielgutierrez/muebleria-hermanos-jota) |
 
> El backend en Render (plan gratuito) puede tardar unos 40 segundos en responder la primera vez mientras se reactiva (*cold start*).
 
## 🧱 Arquitectura y tecnologías
 
```
React (client)  ⇄  Express API (backend)  ⇄  MongoDB Atlas
```
 
- **Frontend:** React 19, Vite, React Router DOM (`useParams`, `useNavigate`)
- **Backend:** Node.js, Express 5, Mongoose 9, jsonwebtoken, bcryptjs, dotenv, cors
- **Base de datos:** MongoDB Atlas
- **Despliegue:** Render (backend) y Netlify (frontend)

## 📁 Estructura
 
```
├── client/           # Servicios y clientes: src/services/productService.js
├── src/              # React: components, pages, routes, services/productService.js
├── backend/          # Express:
│   ├── config/       # db.js (conexión MongoDB)
│   ├── models/       # Product.js, User.js, Order.js
│   ├── middlewares/  # authMiddleware.js (validación JWT)
│   ├── controllers/  # productController.js, orderController.js, authController.js
│   ├── routes/       # productRoutes.js, orderRoutes.js, authRoutes.js
│   ├── tests/        # crud.test.js (11 tests), orders.test.js (14 tests)
│   ├── app.js        # Configuración Express, CORS, rutas
│   └── server.js     # Inicialización del servidor y seed
├── public/           # Assets estáticos y _redirects (para SPA en Netlify)
├── netlify.toml      # Configuración de build y redirecciones de Netlify
├── render.yaml       # Blueprint de infraestructura como código para Render
└── README.md
```
 
## 🔌 API REST

### 1. Catálogo de Productos (Público / Admin)
 
| Método | Endpoint | Protección | Descripción | Éxito |
| --- | --- | --- | --- | --- |
| GET | `/api/productos` | Pública | Todos los productos | `200` |
| GET | `/api/productos/:id` | Pública | Un producto por `_id` o `id` | `200` |
| POST | `/api/productos` | Pública | Crea un producto | `201` |
| PUT | `/api/productos/:id` | Pública | Actualiza un producto | `200` |
| DELETE | `/api/productos/:id` | Pública | Elimina un producto | `200` |
| GET | `/api/health` o `/health` o `/` | Pública | Health check de la API | `200` |

### 2. Autenticación (Sprint 7 y 8 — Integrante 1)

| Método | Endpoint | Protección | Descripción | Éxito |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Pública | Registro de nuevo usuario (hashea contraseña con bcrypt) | `201` |
| POST | `/api/auth/login` | Pública | Login de usuario y generación de token JWT | `200` |
| GET | `/api/auth/me` | JWT | Perfil del usuario autenticado | `200` |

### 3. Pedidos y Seguridad (Sprint 7 y 8 — Integrante 2)

Todas las rutas de pedidos están protegidas mediante el middleware `authMiddleware`, que exige el encabezado `Authorization: Bearer <token>`:

| Método | Endpoint | Protección | Descripción | Éxito |
| --- | --- | --- | --- | --- |
| POST | `/api/orders` | JWT (`Bearer`) | Crea un pedido, valida stock, calcula total en backend y descuenta stock | `201` |
| GET | `/api/orders/my-orders` | JWT (`Bearer`) | Obtiene únicamente los pedidos del usuario autenticado | `200` |
| GET | `/api/orders/:id` | JWT (`Bearer`) | Detalle de un pedido (prohíbe acceso a pedidos de otros usuarios) | `200` |

> Los errores se devuelven en formato JSON `{ "message": "...", "error": "..." }`: `400` (datos inválidos), `401` (token ausente/inválido/expirado), `403` (acceso a pedido ajeno), `404` (no encontrado) y `500` (error interno).
 
## 🧪 Pruebas de Integración y Seguridad

El backend incluye dos suites de pruebas automatizadas con el runner nativo `node:test` (25 tests en total, 0 fallos):

1. **CRUD Productos (`crud.test.js` - 11 tests):**
   - Health check, verificación de CORS con Netlify, operaciones CRUD completas y validaciones.

2. **Seguridad y Pedidos (`orders.test.js` - 14 tests):**
   - **Token ausente:** rechaza petición sin token con `401`.
   - **Formato inválido:** rechaza tokens sin prefijo `Bearer` con `401`.
   - **Token inválido:** rechaza firmas manipuladas con `401`.
   - **Token expirado:** rechaza tokens vencidos con `401`.
   - **Acceso autorizado:** crea pedidos con usuario autenticado (201), calcula el importe usando precios de MongoDB y descuenta stock.
   - **Validaciones:** carrito vacío (400), producto inexistente (404), stock insuficiente (400).
   - **Aislamiento de pedidos ajenos:** cada usuario consulta únicamente su historial (`GET /api/orders/my-orders`), y el acceso directo a pedidos ajenos responde `403 Forbidden`.
   - **Contrato de integración:** registro y login compatibles.

```bash
# Ejecutar todas las pruebas desde la raíz:
npm test

# O ejecutar por suite específica desde backend:
cd backend
npm run test:orders    # Pruebas del Integrante 2
npm run test:crud      # Pruebas del CRUD
```
 
## ⚙️ Instalación y ejecución local
 
Requisitos: Node.js 18+ y MongoDB local o cuenta en MongoDB Atlas.
 
```bash
git clone https://github.com/marielgutierrez/muebleria-hermanos-jota.git
cd muebleria-hermanos-jota
 
# 1. Backend
cd backend
npm install
cp .env.example .env    # configurar MONGODB_URI, PORT=4000 y JWT_SECRET
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
| `JWT_SECRET` | Clave secreta para firma de tokens JWT | `clave_secreta_desarrollo` | `clave_secreta_fuerte_generada_para_render` |
| `JWT_EXPIRES_IN` | Tiempo de vida del token | `7d` | `7d` |
 
**Frontend (`.env` o variables de Netlify / Vercel)**
 
| Variable | Descripción | Ejemplo local | Ejemplo producción |
| --- | --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` | `https://<tu-backend-en-render>.onrender.com/api` |
 
## 🚀 Guía de Despliegue en Producción
 
### 1. Despliegue del Backend en Render
 
1. Ingresá a [Render Dashboard](https://dashboard.render.com/) y seleccioná **New > Web Service**.
2. Conectá el repositorio de GitHub `muebleria-hermanos-jota` (rama `feat/pedidos-backend` o `main`).
3. Configurá los siguientes campos:
   - **Name:** `muebleria-hermanos-jota-backend`.
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. En **Environment Variables**, agregá:
   - `MONGODB_URI`: Tu cadena de conexión de MongoDB Atlas (con IP `0.0.0.0/0` en Network Access de MongoDB Atlas).
   - `CLIENT_URL`: `https://hermanos-jota-store.netlify.app`
   - `JWT_SECRET`: Cadena aleatoria secreta para firmar tokens JWT.
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
5. Hacé clic en **Create Web Service**.
 
### 2. Configuración del Frontend en Netlify
 
1. Ingresá a tu panel de [Netlify](https://app.netlify.com/).
2. Entrá en el sitio correspondiente a `https://hermanos-jota-store.netlify.app/`.
3. Dirigite a **Site configuration > Environment variables**.
4. Creá o editá la variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://<tu-backend-en-render>.onrender.com/api`.
5. En la pestaña **Deploys**, seleccioná **Trigger deploy > Clear cache and deploy site**.
