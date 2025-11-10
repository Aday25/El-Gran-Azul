# 🦀 Frontend - EL GRAN AZUL 🦈
 
En este repositorio del **frontend** de un proyecto fullstack dedicado a la exploración y divulgación de la **biología marina**, donde los usuarios pueden descubrir información fascinante sobre animales, ecosistemas y fenómenos oceánicos.  

La aplicación permite a los usuarios:  
- Explorar **descubrimientos brillantes** relacionados con la biología marina.  
- Consultar publicaciones organizadas en **categorías temáticas**:  
  - 🐠 Vida Marina  
  - 🌊 Ecosistemas Oceánicos  
  - 🔬 Ciencia y Exploración  
  - ⚠️ Problemas y Amenazas  
  - 🌍 Regiones y Océanos del Mundo  
- Crear, editar y eliminar sus propios **posts** con contenido, imágenes y créditos.  
- Interactuar con los posts de otros usuarios mediante **likes**.  
- Disfrutar de animaciones, efectos visuales y un **asistente virtual** que guía a través de tests interactivos.  

La aplicación está diseñada con un enfoque **interactivo y visual**, usando animaciones, partículas y un diseño acuático que mejora la experiencia de navegación y aprendizaje sobre el mundo marino.

---

## 📑 Contenidos

- [🎥 Presentación](#-presentación)
- [Tecnologías usadas](#-tecnologías-usadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Rutas y navegación](#-rutas-y-navegación)
- [CRUD de posts](#-crud-de-posts)
- [Alertas y likes](#-alertas-y-likes)
- [Estilo y componentes reutilizables](#-estilo-y-componentes-reutilizables)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Próximos pasos sugeridos](#-próximos-pasos-sugeridos)

---
## 🎥 Presentación

<a href="https://www.canva.com/design/DAG18WLYmjg/HcOlLKHNWBweeD-9FAHXMA/view?utm_content=DAG18WLYmjg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he81c66c033" target="_blank">
  <img src="/src/assets/presentacion.png" alt="Ver presentación en Canva" width="400" style="border-radius: 12px;"/>
</a>

> 🔗 *Haz clic en la imagen para ver la presentación completa en Canva.*

---
## 💻 Tecnologías usadas

- **Frontend:** React, TypeScript, Vite  
- **UI:** Material UI (MUI), CSS, TailwindCSS  
- **Animaciones:** Framer Motion, tsparticles  
- **Estado global:** Zustand, Context API  
- **Routing:** react-router-dom  
- **Petición HTTP:** Axios  
- **Subida de imágenes:** Cloudinary  
- **Otros:** React Dropzone, Lucide Icons

---

## 🗂 Estructura del proyecto
```
src/
├─ assets/ # Imágenes, iconos, animaciones
├─ components/ # Navbar, Footer, PostCard, VirtualAssistant, etc.
├─ context/ # AlertContext, (futuro ThemeContext)
├─ hooks/ # useAlert, useLike
├─ pages/ # Páginas principales
│ ├─ categories/ # Páginas filtradas por categorías
├─ services/ # Llamadas a API
├─ store/ # Zustand
├─ router/ # Definición de rutas
├─ styles/ # CSS global y específicos
├─ types/ # Interfaces TypeScript
App.tsx # Estructura principal y envoltorio de contextos
main.tsx # Entry point

```

---

## ✨ Funcionalidades principales

- 🐠 Página de bienvenida con animación de animales nadando y botón "Comenzar".
- 🌊 Página de descubrimientos con cards de categorías.
- 🔍 Filtrado de posts por categoría.
- 🧭 Navbar reactivo con:
  - Botones distintos según usuario logado o no.
  - Efecto acuático con degradado.
  - Título clicable para volver al inicio.
- 👤 Autenticación de usuarios:
  - Registro con email de bienvenida.
  - Login con opción de mostrar contraseña.
- ⚙️ Sección “Mi cuenta”:
  - Datos del usuario
  - Acceso a sus posts
  - Cierre de sesión
- 📝 CRUD de posts:
  - Crear, editar y borrar posts.
  - Subida de imágenes mediante Cloudinary.
  - Selección de categorías.
- 🔎 Sección “Post Detail”:
  - Información completa del post
  - Editar, borrar y dar like
- ❤️ Likes sincronizados en tiempo real.
- 🛎 Alertas visuales con colores e iconos según tipo de mensaje.
- 🐧 Asistente virtual (“Foquita”) que guía al usuario a un test interactivo.
- 📌 Footer compartido con logo clicable.

---

## 🛣 Rutas y navegación

- `/` → WelcomePage
- `/login` → LoginPage
- `/register` → RegisterPage
- `/discoveries` → DiscoveriesPage
- `/posts` → AllDiscoveriesPage
- `/posts/:id` → PostDetailPage
- `/posts/new` → CreatePostPage
- `/users/:id` → ProfilePage
- `/admin/users` → UsersAdminPage
- `/categories/marine-life` → MarineLifePage
- `/categories/ocean-ecosystems` → OceanEcosystemsPage
- `/categories/problems-threats` → ProblemsThreatsPage
- `/categories/science-exploration` → ScienceExplorationPage
- `/categories/world-regions` → WorldRegionsPage
- `/category/:slug` → CategoryPostsPage
- `/creators` → CreatorsPage

---

## 📝 CRUD de posts

- **Crear Post**
  - Requiere: título, contenido, al menos una categoría.
  - Opcional: créditos y subida de imágenes.
- **Editar Post**
  - Solo admin o autor puede editar.
  - Permite modificar título, contenido, créditos, categorías e imágenes.
- **Borrar Post**
  - Solo admin o autor puede borrar.
- **Likes**
  - Usuarios logados pueden dar/quitar like.
  - LikesCount se actualiza en todas las páginas en tiempo real.

---

## 🛎 Alertas y likes

- **Alertas**
  - Contexto global `AlertContext`.
  - Tipos: success ✅, error ❌, info ℹ️, warning ⚠️.
  - Imagen de fondo según tipo de alerta.
  - Cierre automático tras unos segundos.
- **Likes**
  - Hook `useLike` con estado local y backend.
  - Validación de IDs y manejo de errores.
  - Sincronización instantánea en todas las páginas.

---

## 🎨 Estilo y componentes reutilizables

- Navbar y Footer compartidos en todas las páginas.
- PostCard para mostrar información de cada post (imagen, título, likes, autor, fecha).
- FormInput y PostForm para formularios de creación/edición.
- VirtualAssistant para test interactivo.
- CSS modular y MUI para paletas, tipografía y botones.
- Imágenes y colores consistentes según tipo de alerta.

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio
```
git clone https://github.com/Grupo5-Biologia-Marina/client.git
Instalar dependencias
```

2. Copiar código
```
cd client
npm install
```
3. Configurar variables de entorno:
Instruccionesen:

.env.example
```
VITE_API_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```
4. Levantar proyecto

```
npm run dev
```
Abrir en navegador en http://localhost:5173

---
## 👩🏻‍💻​ Creadoras

🚢 Aday 🦈 • Irina 🐙 • Julia 🐠 • Luisa 🐬 • Valentina 🐡

---

> **Nota:**  
> Este proyecto forma parte del **bootcamp Fullstack de Factoria F5**.  
> Todos los recursos utilizados, incluidas imágenes y gráficos, tienen **fines educativos**.  
> Algunas imágenes han sido recreadas o generadas con **IA** para ilustrar conceptos y enriquecer la experiencia visual.
> Se indican los enlaces de la fuente y los recursos de la información obtenida en la propia web.








