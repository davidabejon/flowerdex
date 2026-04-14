# Flowerdex

Una aplicación web para identificar, explorar y catalogar flores mediante imágenes y metadatos.

## Resumen

Flowerdex permite a usuarios subir fotos de flores, visualizar colecciones, e intentar identificar especies usando un servicio de reconocimiento en el backend. La aplicación incluye un frontend en React/TypeScript (Vite) y un backend Node.js que expone endpoints para subir imágenes, gestionar usuarios y realizar identificaciones.

## Características

- Subida y gestión de fotos de flores.
- Identificación automatizada mediante servicio backend.
- Visualización de detalles de cada flor y galerías de imágenes.
- Panel de subida con metadatos y traducciones parciales de partes de la flor.

## Estructura del proyecto (resumen)

- `backend/` — servidor Node.js (endpoints, base de datos ligera y servicios de identificación).
- `public/` — recursos estáticos públicos.
- `src/` — frontend en React + TypeScript (componentes, vistas y utilidades).
- `src/components/` — componentes UI principales (`FlowerList`, `FlowerDetail`, `UploadPanel`, etc.).
- `src/data/flowersData.ts` — datos iniciales de las flores.

## Requisitos

- Node.js (versión 16+ recomendada)
- npm o yarn

## Instalación y ejecución (desarrollo)

1) Instalar dependencias del proyecto (raíz/front-end)

```bash
npm install
```

2) Ejecutar el frontend (Vite)

```bash
npm run dev
```

3) Instalar y arrancar el backend

```bash
cd backend
npm install
npm run dev
```

Nota: revisa `backend/package.json` para los scripts disponibles.

## Variables de entorno

El backend requiere variables de entorno. Crea un archivo `.env` en `backend/` según la necesidad y consulta `backend/.env.example`.

## Uso

1. Abrir la aplicación frontend en el navegador (normalmente en `http://localhost:5173` con Vite).
2. Crear una cuenta o usar la funcionalidad de usuario si el backend está corriendo.
3. Subir imágenes desde el panel `Upload` y revisar resultados en `UploadedPhotos` y `FlowerDetail`.

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama con la mejora/bugfix: `git checkout -b feat/nueva-funcionalidad`.
3. Envía un Pull Request describiendo los cambios.

Por favor, añade tests y documentación para cambios significativos.

## Contacto

Si tienes preguntas o quieres colaborar, abre un issue en el repositorio o contacta conmigo.

---
