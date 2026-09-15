🌸 Tablero Kanban (Gestión de Tareas)

# Tablero Kanban para Gestión de Proyectos y Tareas

Aplicación web tipo Trello/Kanban para equipos de desarrollo. Permite organizar tareas en columnas, moverlas mediante drag & drop, editarlas, comentarlas y eliminarlas, con persistencia en una API REST simulada con json-server.

## Stack tecnológico

- HTML5 semántico, CSS3 y JavaScript ES6+
- SortableJS para drag & drop
- json-server para simulación de API REST
- Stitch para wireframes y mockups
- GitHub, GitHub Projects y Visual Studio Code

### Instalación y Ejecución de `json-server`

Para poner en marcha la API simulada, se instala json-server de forma global con el comando:
npm install -g json-server 
A continuación, en la raíz del proyecto, donde se encuentra el archivo db.json, y se ejecuta: json-server --watch db.json --port 5500 
para levantar el servidor en http://localhost:5500, de modo que la aplicación pueda realizar las peticiones fetch a los endpoints REST definidos en dicho archivo.

## Funcionalidades

- Tablero Kanban con columnas: Por Hacer, En Proceso y Finalizado.
- Cabecera con estadísticas rápidas del total de tareas por columna.
- Carga dinámica de tareas desde json-server mediante fetch (GET).
- Renderizado de tarjetas según la propiedad `status`.
- Creación de tarjetas mediante modal: título, descripción, prioridad y fecha límite (POST).
- Asignación por defecto de nuevas tarjetas a la columna Por Hacer.
- Drag & drop entre columnas con actualización automática del `status` en el servidor (PATCH).
- Modal de detalle con edición de título y descripción (PUT / PATCH).
- Sistema de comentarios por tarjeta: listado y formulario de alta (GET / POST).
- Eliminación permanente de tarjetas del DOM y de db.json (DELETE).
- Buscador en tiempo real por título.
- Menú de navegación responsive con hamburguesa gestionado con JavaScript Vanilla.

EXTRAS
- Registro de usuarios (POST /users) y asignación de un responsable a cada tarjeta.
- Clasificación de tarjetas por categorías y filtrar el tablero por prioridad, etiqueta o usuario asignado.

## Arquitectura del proyecto

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── api.js
│   ├── app.js
│   ├── config.js
|   └── ui.js
├── db.json
├── .gitignore
├── .env
├── package-lock.json
├── package.json
├── server.js
└── README.md
