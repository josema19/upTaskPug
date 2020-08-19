// Importar librerías
import Swal from 'sweetalert2';
import axios from 'axios';

// Ejecutar diversas funciones
const btnEliminar = document.querySelector('#eliminar-proyecto');
if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        // Obtener url
        const urlProyecto = e.target.dataset.proyectoUrl;

        // Ejecutar Alerta
        Swal.fire({
            title: 'Deseas borrar este Proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                // Enviar petición a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`
                axios.delete(url, { params: { urlProyecto } }).then(res => {
                    Swal.fire(
                        'Proyecto Eliminado!',
                        res.data,
                        'success'
                    );
                    // Redireccionar
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                }).catch(error => {
                    console.log(error);
                    Swal.fire(
                        'Hubo un error',
                        'No se pudo eliminar el Proyecto',
                        'error'
                    );
                });
            };
        });
    });
};

// Exportar
export default btnEliminar;