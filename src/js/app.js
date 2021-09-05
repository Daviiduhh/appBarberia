let pagina = 1;

const cita = {
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarApp();

  //Resalta el DIv actual segun el tab/pestaña que se presiona
  mostrarSeccion();

  //Oculata o muestra la seccion segun el tab que se presiona
  cambiarSeccion();

  //Paginacion siguiente y anterior
  paginaSiguiente();
  paginaAnterior();

  //Comprueba la pagina actual para ocultar/mostrar la paginacion
  botonesPaginador();

  //Muestra el resumen de la cita, o el mensaje de que está vacia o oncompleta
  mostrarResumen();
});

function mostrarSeccion() {
  //Eliminar seccion anterior
  const seccionAnterior = document.querySelector(".mostrar-seccion");
  if(seccionAnterior){
    seccionAnterior.classList.remove("mostrar-seccion");
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add("mostrar-seccion");

  //Eliminar la clase "resaltar-boton" en el tab enterior
  const tabAnterior = document.querySelector(".tabs .resaltar-boton");
  if(tabAnterior){
    tabAnterior.classList.remove("resaltar-boton");
  }

  //Resaltar boton de pagina actual
  const botonActual = document.querySelector(`[data-paso="${pagina}"]`);
  botonActual.classList.add("resaltar-boton");
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll(".tabs button");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault();

      pagina = parseInt(event.target.dataset.paso);

      //Llamar la funcion de mostrar seccion para que tambien funciones los tabs
      mostrarSeccion();

      botonesPaginador();
    });
  });
}

function iniciarApp() {
  mostrarServicios();
}

async function mostrarServicios() {
  try {
    const resultado = await fetch("./servicios.json");
    const db = await resultado.json();

    const { servicios } = db;

    //Generar el HTML
    const listadoServicios = document.querySelector(".listado-servicios");

    servicios.forEach((servicio) => {
      const { id, nombre, precio } = servicio;

      //DOM scripting
      //Generar nombre de servicio
      const nombreServicio = document.createElement("p");
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add("nombre-servicio");

      //Generar precio del servicio
      const precioServicio = document.createElement("p");
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add("precio-servicio");

      //Generar div contenedor servicio
      const servicioDiv = document.createElement("div");
      servicioDiv.classList.add("servicio");
      servicioDiv.dataset.idServicio = id;

      //Seleccionar servicio
      servicioDiv.onclick = seleccionarServicio;

      //Agregar precio y nombre al div de servicio
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);

      listadoServicios.appendChild(servicioDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

function seleccionarServicio(event) {
  let elemento;

  //Forzar que al dar click se le de al ID
  if (event.target.tagName === "P") {
    elemento = event.target.parentElement;
  } else {
    elemento = event.target;
  }

  if (elemento.classList.contains("seleccionado")) {
    elemento.classList.remove("seleccionado");
  } else {
    elemento.classList.add("seleccionado");
  }
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    pagina++;
    botonesPaginador();
    console.log(pagina);
  });
}
function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    pagina--;
    botonesPaginador();
    console.log(pagina);
  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAnterior = document.querySelector("#anterior");
  if (pagina === 1) {
    paginaAnterior.classList.add("ocultar");
  } else if (pagina === 3) {
    paginaSiguiente.classList.add("ocultar");
    paginaAnterior.classList.remove("ocultar");
  } else {
    document.querySelector(".ocultar").classList.remove("ocultar");
  }
  mostrarSeccion();
}

function mostrarResumen() {
  //Destructuring
  const { nombre, fecha, hora, servicios } = cita;

  //Seleccionar resumen
  const resumenDiv = document.querySelector('.contenido-resumen');

  //Validacion de objeto
  if(Object.values(cita).includes('')) { //Si alguno incluye algun string vacio
    const noServicios = document.createElement('p');
    noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';

    noServicios.classList.add('text-center');
    noServicios.classList.add('invalidar-cita');

    //Agregar a resumenDiv
    resumenDiv.appendChild(noServicios);
  }
}