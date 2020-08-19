// Importar librerías
import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import { actualizarAvance } from './funciones/avance';

// Ejecutar cambios DOM
document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
});