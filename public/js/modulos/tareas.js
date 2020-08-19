// Importar librerías
import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

// Ejecutar diversas funciones
const tareas = document.querySelector('.listado-pendientes');
if (tareas) {
    tareas.addEventListener('click', e => {
        // Actualizar estado
        if (e.target.classList.contains('fa-check-circle')) {
            // Obtener id de Tarea
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // Hacer request
            const url = `${location.origin}/tareas/${idTarea}`
            axios.patch(url, { idTarea }).then(res => {
                if (res.status === 200) {
                    icono.classList.toggle('completo');
                    actualizarAvance();
                };
            }).catch(error => {
                console.log(error);
            });
        };

        // Eliminar tarea
        if (e.target.classList.contains('fa-trash')) {
            // Obtener el html de la tarea y el id de la tarea
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            // Ejecutar Alerta
            Swal.fire({
                title: 'Deseas borrar esta Tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.value) {
                    // Enviar petición a axios
                    const url = `${location.origin}/tareas/${idTarea}`
                    axios.delete(url, { params: { idTarea } }).then(res => {
                        // Actualziar DOM
                        tareaHTML.parentElement.removeChild(tareaHTML);

                        // Mostrar mensaje
                        Swal.fire(
                            'Tarea Eliminada!',
                            res.data,
                            'success'
                        );

                        // Avance de tarea
                        actualizarAvance();
                    }).catch(error => {
                        console.log(error);
                        Swal.fire(
                            'Hubo un error',
                            'No se pudo eliminar la Tarea',
                            'error'
                        );
                    });
                };
            });
        };
    });
};

// Exportar
export default tareas;