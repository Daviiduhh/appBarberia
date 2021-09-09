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

  //Almacena el nombre, fecha y hora de la cita en el objeto
  nombreCita();
  fechaCita();
  horaCita();

  //Deshabilitar fechas anteriores
  deshabilitarFechaAnterior();
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

    const id = parseInt(elemento.dataset.idServicio);

    eliminarServicio(id);
  } else {
    elemento.classList.add("seleccionado");

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.lastElementChild.textContent
    }

    agregarServicio(servicioObj);
  }
}

function eliminarServicio(id) {
  const { servicios } = cita;
  cita.servicios = servicios.filter( servicio => servicio.id !== id );
}
function agregarServicio(servicioObj) {
  const { servicios } = cita;
  cita.servicios = [...servicios, servicioObj];
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    pagina++;
    botonesPaginador();
  });
}
function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    pagina--;
    botonesPaginador();
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

    mostrarResumen(); //Cuando nos metemos a pagina 3
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

  //Limpiar html previo
  while(resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild);
  } //Mucho mas optimizazdo que innerHTML

  //Validacion de objeto
  if(Object.values(cita).includes('')) { //Si alguno incluye algun string vacio
    const noServicios = document.createElement('p');
    noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';

    noServicios.classList.add('text-center');
    noServicios.classList.add('invalidar-cita');

    //Agregar a resumenDiv
    resumenDiv.appendChild(noServicios);

    return; //Funciona como else, se salta el siguiente trozo de codigo
  } 

  //Mostrar resumen
  const headingCita = document.createElement('h3');
  headingCita.textContent = "Resumen de cita";

  const nombreCita = document.createElement('p');
  nombreCita.innerHTML = `Nombre: <span>${nombre}</span>`; //Agrega el contenido dentro del elemento p

  const fechaCita = document.createElement('p');
  fechaCita.innerHTML = `Fecha: <span>${fecha}</span>`; 

  const horaCita = document.createElement('p');
  horaCita.innerHTML = `Hora: <span>${hora}</span>`; 

  const serviciosResumen = document.createElement('div');
  serviciosResumen.classList.add('servicios-resumen');
  const headingServicios = document.createElement('h3');
  headingServicios.textContent = "Servicios agregados";
  serviciosResumen.appendChild(headingServicios);
  //Iterar sobre el arreglo de servicios

  servicios.forEach(servicio => {
    const { nombre, precio } = servicio;

    const contenedorServicio = document.createElement('div');
    contenedorServicio.classList.add('contenedor-servicio');

    const nombreServicio = document.createElement('p');
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement('p');
    precioServicio.textContent = precio;

    contenedorServicio.appendChild(nombreServicio);
    contenedorServicio.appendChild(precioServicio);

    serviciosResumen.appendChild(contenedorServicio);
  });

  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);
  resumenDiv.appendChild(serviciosResumen);
}

function nombreCita() {
  const nombreInput = document.querySelector('#nombre');

  nombreInput.addEventListener('input', evento => {
    const nombreTexto = evento.target.value.trim(); //Trim elimina espacios en blanco
    
    //validacion para que nombre no esté vacio
    if(nombreTexto === '' || nombreTexto.length<2){
      mostrarAlerta('error','Nombre no valido');
    } else {
      const alerta = document.querySelector('.alerta');

      if(alerta) {
        alerta.remove();
      }

      cita.nombre = nombreTexto;
    }
  });
}

function fechaCita() {
  const fechaCita = document.querySelector('#fecha');
  fechaCita.addEventListener('input', evento => {
    const dia = new Date(evento.target.value).getUTCDay(); //Domingo === 0

    if(dia === 1){
      evento.preventDefault();
      fechaCita.value = '';
      mostrarAlerta('error', 'Los lunes no se labora');
    } else {
      cita.fecha = fechaCita.value;
      console.log(cita);
    }
  });
}

function horaCita() {
  const horaInput = document.querySelector('#hora');
    horaInput.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':')

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarAlerta('error','Hora no válida');
            setTimeout(() => {
              horaInput.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;
        }
    })
}

function mostrarAlerta(tipo, mensaje) {
  //Si hay alerta previa no mostrar otra
  const alertaPrevia = document.querySelector('.alerta');

  if(alertaPrevia) {
    alertaPrevia.remove(); //Tambien puede ser return;
  }
  const alerta = document.createElement('div');
    alerta.textContent = `${tipo}: ${mensaje}`;
    alerta.classList.add('alerta');
    
    if(tipo === 'error'){
      alerta.classList.add('error');
    } 

    //Insertar en el formulario
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta depues de 3 segundos
    setTimeout(() => {
      alerta.remove();
    }, 3000);
}

function deshabilitarFechaAnterior() {
  const inputFecha = document.querySelector('#fecha');

  const fechaAhora = new Date();
  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  fechaAhora.setDate(fechaAhora.getDate() + 1);
  const dia = fechaAhora.getDate() + 1;
  
  //Formato deseado aaaa-mm-dd
  const deshabilitarFecha = `${year}-${mes}-${dia}`;

  inputFecha.min = deshabilitarFecha;
}