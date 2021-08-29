document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        //Generar el HTML
        const listadoServicios = document.querySelector('.listado-servicios');

        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            //DOM scripting
            //Generar nombre de servicio
            const nombreServicio = document.createElement('p');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('p');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div servicio
            const servicioDiv = document.createElement('div');
            servicioDiv.classList.add('servicio')

            //Agregar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            listadoServicios.appendChild(servicioDiv);

            console.log(servicioDiv)
        })
    } catch (error) {
        console.log(error);
    }
}