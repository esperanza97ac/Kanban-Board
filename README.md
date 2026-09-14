# 🌸 Tablero Kanban Interactivo (Gestión de Tareas)

Un tablero Kanban interactivo para la gestión de tareas en tiempo real, desarrollado con **HTML5 semántico**, **CSS3 adaptativo** y **JavaScript modular (ES Modules)** apoyado por una API REST local mediante `json-server`.

---

## 📋 Tabla de Contenidos
- [Demostración y Evidencia](#-demostración-y-evidencia)
- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos No Funcionales Cumplidos](#-requisitos-no-funcionales-cumplidos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso y Flujo de Trabajo](#-uso-y-flujo-de-trabajo)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)

---

## 📹 Demostración y Evidencia

> **Nota sobre el Despliegue:** Dado que la aplicación requiere un backend/API REST local (`server.js` + `db.json`), la funcionalidad completa con persistencia de datos requiere ejecución local.

---

## ✨ Características Principales

* **Organización en 3 Columnas:** *Por Hacer*, *En Proceso* y *Finalizado*.
* **Drag & Drop Intuitive:** Arrastra y suelta tarjetas entre columnas actualizando automáticamente su estado mediante peticiones `PATCH`.
* **Menú Hamburguesa Integrado:** Filtros dinámicos, accesibles desde la cabecera:
  * 🔍 Búsqueda por título.
  * 👤 Filtro por persona asignada.
  * ⚡ Filtro por nivel de prioridad (Alta, Media, Baja).
  * 🗓️ Filtro por fecha límite.
* **Gestión Completa de Tareas (CRUD):** Crear, editar detalles, cambiar asignados o prioridad, y eliminar tareas.
* **Sistema de Comentarios:** Añade comentarios dentro del detalle de cada tarea almacenados de forma independiente en la API.
* **Estadísticas en Tiempo Real:** Contadores dinámicos por estado y globales en la cabecera.

---

## 📁 Arquitectura del Proyecto

El proyecto sigue una estructura modular y limpia para separar las responsabilidades de la aplicación:

```text
├── css/
│   └── styles.css          # Estilos globales, variables CSS, layout Grid/Flexbox y responsive
├── js/
│   ├── api.js              # Servicios HTTP (GET, POST, PUT, PATCH, DELETE) mediante async/await
│   ├── app.js              # Controlador principal, manejo de estado y eventos
│   ├── config.js           # Constantes globales (Endpoints, Usuarios, Estados)
│   └── ui.js               # Funciones de renderizado en el DOM, modales y toast
├── .env                    # Variables de entorno locales (puerto, URL API)
├── .env.example            # Plantilla de ejemplo de variables de entorno
├── .gitignore              # Archivos excluidos del control de versiones (node_modules, .env)
├── db.json                 # Base de datos simulada para json-server
├── index.html              # Estructura principal HTML5 accesible y semántica
├── package.json            # Dependencias del proyecto y scripts de ejecución
├── README.md               # Documentación del proyecto
└── server.js               # Configuración del servidor backend local