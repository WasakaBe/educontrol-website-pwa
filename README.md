# EduControl-pwa

## Descripción: 
es una pagina web institucional donde se realizaran creación de credenciales de una forma mas rápida, los alumnos podrán realizar registros, solicitar credenciales y también podrán tener acceso a una credencial virtual, los maestros podrán tomar asistencia, y los padres de familia podrán visualizar el registro de asistencia de los alumnos. Se busca transformar el sistema web escolar existente en una **PWA (Progressive Web App)**, mejorando la accesibilidad y funcionalidad, incluyendo la capacidad de trabajar sin conexión y un sistema de retroalimentación para los usuarios.

## Objetivos:
- Optimizar el rendimiento y accesibilidad de la plataforma.
- Implementar funcionalidad offline mediante PWA.
- Integrar un sistema de retroalimentación de usuarios.

Metodología: 
Utilizamos la metodología **Scrum** para gestionar el desarrollo en ciclos cortos y flexibles (sprints), garantizando entregas continuas y mejoras constantes del sistema.

## Herramienta de Control de Versiones

Para este proyecto utilizamos **Git** como herramienta de control de versiones, siguiendo el flujo de trabajo **GitFlow** para la gestión de ramas y versiones.

### Flujo de Trabajo:

- Las ramas principales son `main` (para producción) y `develop` (para desarrollo).
- Las nuevas funcionalidades se desarrollan en ramas `feature/*` que se crean a partir de `develop`.
- Al estar listas, las funcionalidades se fusionan de vuelta en `develop`.

## Herramientas a utilizar:
El uso de Jira para el proyecto permitirá gestionar tareas, hacer seguimiento del progreso y controlar el flujo de trabajo de manera más eficiente. 

## Tecnologías Utilizadas
-FrontEnd: React. js, vite
-BackEnd: python (Flask)
-Base de Datos: MySQL

 ## Estrategia de Versionamiento

Utilizamos la estrategia de **versionamiento SemVer (Versionado Semántico)** y el flujo de trabajo **GitFlow**.

### Ramas:
- `main`: Contiene el código estable en producción.
- `develop`: Contiene el código en desarrollo para la próxima versión.
- `feature/*`: Para el desarrollo de nuevas funcionalidades.
- `release/*`: Para preparar versiones finales antes del despliegue.
- `hotfix/*`: Para corrección de errores críticos en producción.

### Ejemplo de Versionado:
- Versión inicial: `v1.0.0`
- Nueva funcionalidad menor: `v1.1.0`
- Corrección de errores: `v1.1.1`

## Estrategia de Despliegue

Implementamos la estrategia **Blue-Green Deployment** para asegurar despliegues sin interrupciones y minimizar los riesgos.

### Entornos:
- **Entorno Blue**: Ambiente en producción con la versión actual.
- **Entorno Green**: Ambiente de pruebas para las nuevas versiones.

### Proceso de Despliegue:
1. Desplegar en el entorno Green.
2. Realizar pruebas exhaustivas.
3. Hacer el cambio de tráfico a Green si todo está correcto.
4. Mantener el entorno Blue como respaldo para revertir si es necesario.

## Instalación del Proyecto

### Clonar el repositorio:
```bash
git clone https://github.com/WasakaBe/EduControlWebsite.git
cd proyecto-web-escolar

## Instalar dependencias:
npm install

## Ejecutar el proyecto:
npm start