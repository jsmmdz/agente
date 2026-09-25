// LOGIN: user y pass vienen de CREDENCIALES.JS, que se carga antes que este
// archivo. Mientras no se valide, #app-gestion queda con hidden y el único
// panel visible es #panel-login.
const panelLogin = document.getElementById("panel-login");
const appGestion = document.getElementById("app-gestion");
const formLogin = document.getElementById("form-login");
const loginError = document.getElementById("login-error");

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = new FormData(formLogin);
  const usuarioIngresado = datos.get("usuario").trim();
  const passIngresado = datos.get("password");

  if (usuarioIngresado === user && passIngresado === pass) {
    panelLogin.hidden = true;
    appGestion.hidden = false;
  } else {
    loginError.hidden = false;
    formLogin.password.value = "";
  }
});

const tablaPlatos = document.getElementById("tabla-platos");

// READ: recorre platosColombia (de data.js) y arma una fila de tabla por
// cada plato. No modifica el array, solo lo lee para pintar el DOM.
function mostrarPlatos() {
  tablaPlatos.innerHTML = "";

  platosColombia.forEach((plato) => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = plato.nombre;

    const celdaRegion = document.createElement("td");
    celdaRegion.textContent = plato.region;

    const celdaTiempo = document.createElement("td");
    celdaTiempo.textContent = plato.tiempoPreparacionMin;

    const celdaVegetariano = document.createElement("td");
    celdaVegetariano.textContent = plato.esVegetariano ? "Sí" : "No";

    fila.append(celdaNombre, celdaRegion, celdaTiempo, celdaVegetariano);
    tablaPlatos.appendChild(fila);
  });
}

mostrarPlatos();

// CREATE: toma los valores del formulario, arma un objeto plato con la misma
// forma que los de data.js y lo agrega al array con push. FormData lee los
// campos por su atributo "name", por eso los inputs del form se llaman igual
// que las propiedades del objeto (nombre, region, etc.).
const formCrear = document.getElementById("form-crear");

formCrear.addEventListener("submit", function (evento) {
  // preventDefault evita que el navegador recargue la página al enviar el
  // formulario, que es el comportamiento por defecto de <form>.
  evento.preventDefault();

  const datos = new FormData(formCrear);

  const nuevoPlato = {
    nombre: datos.get("nombre").trim(),
    region: datos.get("region").trim(),
    tiempoPreparacionMin: Number(datos.get("tiempoPreparacionMin")),
    esVegetariano: datos.get("esVegetariano") === "on",
    descripcionBreve: datos.get("descripcionBreve").trim(),
    // El input llega como un solo string "Dulce, Salado" y hay que separarlo
    // en array: split por coma, trim a cada sabor y filter para descartar
    // strings vacíos si el campo se dejó en blanco o con comas de más.
    saboresDominantes: datos
      .get("saboresDominantes")
      .split(",")
      .map((sabor) => sabor.trim())
      .filter((sabor) => sabor !== ""),
  };

  platosColombia.push(nuevoPlato);
  guardarPlatos();
  mostrarPlatos();
  mostrarEliminar();
  mostrarOpcionesEditar();
  formCrear.reset();
});

// DELETE: pinta un listado igual al de READ pero con un botón "Eliminar" por
// fila. El botón guarda el índice del plato en data-index; splice(indice, 1)
// es el método que saca un elemento del array en esa posición exacta (a
// diferencia de pop/shift, que solo tocan los extremos).
const tablaEliminar = document.getElementById("tabla-eliminar");

function mostrarEliminar() {
  tablaEliminar.innerHTML = "";

  platosColombia.forEach((plato, indice) => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = plato.nombre;

    const celdaRegion = document.createElement("td");
    celdaRegion.textContent = plato.region;

    const celdaTiempo = document.createElement("td");
    celdaTiempo.textContent = plato.tiempoPreparacionMin;

    const celdaVegetariano = document.createElement("td");
    celdaVegetariano.textContent = plato.esVegetariano ? "Sí" : "No";

    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "gestion-btn-peligro";
    botonEliminar.dataset.index = indice;
    celdaAcciones.appendChild(botonEliminar);

    fila.append(celdaNombre, celdaRegion, celdaTiempo, celdaVegetariano, celdaAcciones);
    tablaEliminar.appendChild(fila);
  });
}

// Un solo listener en el <tbody> (delegación de eventos) en vez de uno por
// botón: como las filas se recrean cada vez que se llama a mostrarEliminar(),
// un listener puesto directo en cada botón se perdería al redibujar la
// tabla. El <tbody> nunca se destruye, así que el listener sobrevive.
tablaEliminar.addEventListener("click", function (evento) {
  if (evento.target.tagName !== "BUTTON") {
    return;
  }

  const indice = Number(evento.target.dataset.index);
  const plato = platosColombia[indice];

  const confirmado = confirm(`¿Seguro que querés eliminar "${plato.nombre}"?`);
  if (!confirmado) {
    return;
  }

  platosColombia.splice(indice, 1);
  guardarPlatos();
  mostrarPlatos();
  mostrarEliminar();
  mostrarOpcionesEditar();
  cargarPlatoEnFormulario();
});

mostrarEliminar();

// UPDATE: el <select> se llena con un <option> por plato (value = índice en
// el array). Elegir una opción precarga el formulario con los datos actuales
// de ese plato; enviar el formulario confirma con el usuario y reemplaza
// esa posición del array con los valores nuevos, sin tocar los demás platos.
const formEditar = document.getElementById("form-editar");
const selectEditar = document.getElementById("select-editar");

function mostrarOpcionesEditar() {
  selectEditar.innerHTML = "";

  platosColombia.forEach((plato, indice) => {
    const opcion = document.createElement("option");
    opcion.value = indice;
    opcion.textContent = plato.nombre;
    selectEditar.appendChild(opcion);
  });
}

// Llena los demás campos del form con los datos del plato en la posición
// elegida. Se llama al cambiar el select y también apenas se listan las
// opciones, para que el form arranque mostrando el primer plato.
function cargarPlatoEnFormulario() {
  const indice = Number(selectEditar.value);
  const plato = platosColombia[indice];

  if (!plato) {
    return;
  }

  formEditar.nombre.value = plato.nombre;
  formEditar.region.value = plato.region;
  formEditar.tiempoPreparacionMin.value = plato.tiempoPreparacionMin;
  formEditar.esVegetariano.checked = plato.esVegetariano;
  formEditar.descripcionBreve.value = plato.descripcionBreve;
  formEditar.saboresDominantes.value = plato.saboresDominantes.join(", ");
}

selectEditar.addEventListener("change", cargarPlatoEnFormulario);

formEditar.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const indice = Number(selectEditar.value);
  const platoActual = platosColombia[indice];

  if (!platoActual) {
    return;
  }

  const confirmado = confirm(`¿Guardar los cambios de "${platoActual.nombre}"?`);
  if (!confirmado) {
    return;
  }

  const datos = new FormData(formEditar);

  // Se reemplaza el objeto completo en la misma posición del array (misma
  // idea que en CREATE), en vez de ir pisando propiedad por propiedad.
  platosColombia[indice] = {
    nombre: datos.get("nombre").trim(),
    region: datos.get("region").trim(),
    tiempoPreparacionMin: Number(datos.get("tiempoPreparacionMin")),
    esVegetariano: datos.get("esVegetariano") === "on",
    descripcionBreve: datos.get("descripcionBreve").trim(),
    saboresDominantes: datos
      .get("saboresDominantes")
      .split(",")
      .map((sabor) => sabor.trim())
      .filter((sabor) => sabor !== ""),
  };

  guardarPlatos();
  mostrarPlatos();
  mostrarEliminar();
  mostrarOpcionesEditar();
});

mostrarOpcionesEditar();
cargarPlatoEnFormulario();
