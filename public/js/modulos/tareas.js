import axios from "axios";
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')); {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia tarea:id
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, { idTarea })
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                });
        }
        if (e.target.classList.contains('fa-trash')) {
            const tareaHtml = e.target.parentElement.parentElement,
                idTarea = tareaHtml.dataset.tarea;

            Swal.fire({
                title: 'Deseas eliminar esta Tarea?',
                text: "No se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, { params: { idTarea } })
                        .then(function (respuesta) {
                            if (respuesta.status === 200) {
                                console.log(respuesta);
                            tareaHtml.parentElement.removeChild(tareaHtml);
                            }

                            //una alerta
                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'succes'
                            )

                            actualizarAvance();
                        })
                }
            });
        };
    });
}
export default tareas;