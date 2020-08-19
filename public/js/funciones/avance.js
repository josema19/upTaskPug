// Importar librerías
import Swal from 'sweetalert2';

// Exportar función
export const actualizarAvance = () => {
    // Seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        // Seleccionar tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        // Calcular avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // Mostrar Avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        // Mostrar alerta en caso de completar las tareas
        if (avance === 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades, has terminado tus tareas',
                'success'
            );
        };
    };
};