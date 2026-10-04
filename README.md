# Mueblería Hermanos Jota - E-commerce

E-commerce desarrollado como proyecto grupal, enfocado en construir una experiencia de compra interactiva para una mueblería. El proyecto integra un frontend desarrollado con React y un backend construido con Node.js y Express, que permite consultar los productos mediante una API REST.

## 📅 Información del proyecto

* **Equipo:** Grupo E
* **Entrega:** Sprint 3 y Sprint 4
* **Tipo de proyecto:** E-commerce

## 👥 Integrantes

* Juan Ignacio Sotomayor
* Mariel Gutiérrez
* Marcos Gabriel Sánchez Matus
* Araceli Virginia Mendoza 
* Florencia Mainoli

## 📖 Descripción del proyecto

El sitio simula una tienda online de muebles, con una interfaz responsiva y componentes reutilizables desarrollados en React. Los productos son gestionados desde el backend y se obtienen desde el frontend mediante peticiones HTTP a una API REST.


### Objetivos de aprendizaje

* Construir una interfaz web utilizando React.
* Crear componentes reutilizables y comunicarlos mediante props.
* Gestionar estados e interacciones utilizando `useState`.
* Obtener información del backend mediante peticiones `fetch`.
* Desarrollar un servidor utilizando Node.js y Express.
* Crear rutas para exponer los datos de productos mediante una API REST.
* Organizar las rutas del backend utilizando `express.Router`.
* Implementar middleware personalizado para registrar las solicitudes.
* Manejar estados de carga, errores y respuestas exitosas.
* Trabajar colaborativamente utilizando Git y GitHub.

## ⚙️ Funcionalidades

### 🏠 Página de Inicio

* Header con logo y navegación.
* Hero principal con presentación de la mueblería.
* Sección de productos destacados.
* Sección de valores e identidad de la marca.
* Footer con información del basica de la muebleria.

### 🛋️ Catálogo de Productos

* Grilla de tarjetas de productos.
* Productos obtenidos desde la API del backend.
* Información de cada producto, como nombre, precio e imagen.
* Componentes reutilizables para mostrar los productos.

### 🔍 Detalle de Producto

* Visualización de la información completa de un producto.
* Imagen, descripción, precio y características.
* Interacción para agregar productos al carrito.

### ✉️ Contacto

* Formulario de contacto con campos controlados mediante React.
* Validación de los datos ingresados.
* Mensajes de respuesta para el usuario.

### 🛒 Carrito

* Estado del carrito gestionado desde React.
* Contador de productos visible en la navegación.
* Actualización de la interfaz según las interacciones del usuario.

> Las funcionalidades se irán integrando y completando durante el desarrollo del proyecto.

## 🛠️ Tecnologías utilizadas

* **React** — construcción de la interfaz mediante componentes reutilizables.
* **JavaScript** — lógica de la aplicación, manejo de eventos y estados.
* **Node.js** — entorno de ejecución del backend.
* **Express** — creación del servidor y de la API REST.
* **HTML5** — estructura de la aplicación.
* **CSS3** — estilos y diseño responsivo.
* **Git & GitHub** — control de versiones y trabajo colaborativo.


* La comunicación entre ambas partes se realiza mediante solicitudes HTTP utilizando `fetch`.
* El trabajo se organiza en equipo mediante Git y GitHub, utilizando ramas para desarrollar e integrar cambios.
## 🚀 Instrucciones de Instalación y Ejecución

Para ejecutar el proyecto de forma local, sigue los siguientes pasos:
Necesitás tener instalados [Node.js](https://nodejs.org/) (v18 o superior) y Git. El proyecto tiene dos partes que se ejecutan **al mismo tiempo, cada una en su propia terminal**.

### 1. Clonar el repositorio

```bash
git clone https://github.com/marielgutierrez/muebleria-hermanos-jota.git
cd muebleria-hermanos-jota
```

### 2. Levantar el backend (API REST)

```bash
cd backend
npm install
npm start
```

El servidor queda corriendo en `http://localhost:3000`.

### 3. Levantar el frontend (React)

En una **segunda terminal**, desde la raíz del proyecto:

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.
