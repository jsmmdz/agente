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
const tablaEliminar = document.getElementById("tabla-eliminar");
const formCrear = document.getElementById("form-crear");
const formEditar = document.getElementById("form-editar");
const selectEditar = document.getElementById("select-editar");

// "platos" es una copia local de lo que hay en Supabase. Se vuelve a pedir
// (recargarPlatos) después de cada CREATE / UPDATE / DELETE, así la pantalla
// siempre refleja la base de datos real y no un array que pudo quedar viejo.
// Cada plato se identifica por su id de la base de datos (no por su posición).
let platos = [];

async function recargarPlatos() {
  const lista = await listarPlatos();
  if (!lista) {
    alert("No se pudieron cargar los platos. Revisa la consola.");
    return;
  }
  platos = lista;
  mostrarPlatos();
  mostrarEliminar();
  mostrarOpcionesEditar();
  cargarPlatoEnFormulario();
}

// Lee el formulario y arma el objeto con la misma forma que las columnas de
// la tabla. No lleva id: Postgres lo genera al insertar. FormData lee los
// campos por su atributo "name".
function leerFormulario(formulario) {
  const datos = new FormData(formulario);
  return {
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
}

// READ: arma una fila de tabla por cada plato de la lista.
function mostrarPlatos() {
  tablaPlatos.innerHTML = "";

  platos.forEach((plato) => {
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

// CREATE: el listener es async para poder esperar (await) a que Supabase
// confirme el insert antes de refrescar la pantalla.
formCrear.addEventListener("submit", async function (evento) {
  // preventDefault evita que el navegador recargue la página al enviar el
  // formulario, que es el comportamiento por defecto de <form>.
  evento.preventDefault();

  const nuevo = await agregarPlato(leerFormulario(formCrear));
  if (!nuevo) {
    alert("No se pudo agregar el plato. Revisa la consola.");
    return;
  }

  formCrear.reset();
  await recargarPlatos();
});

// DELETE: listado igual al de READ pero con un botón "Eliminar" por fila. El
// botón guarda el id del plato en data-id; eliminarPlato(id) borra esa fila
// de la base de datos.
function mostrarEliminar() {
  tablaEliminar.innerHTML = "";

  platos.forEach((plato) => {
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
    botonEliminar.dataset.id = plato.id;
    celdaAcciones.appendChild(botonEliminar);

    fila.append(celdaNombre, celdaRegion, celdaTiempo, celdaVegetariano, celdaAcciones);
    tablaEliminar.appendChild(fila);
  });
}

// Un solo listener en el <tbody> (delegación de eventos) en vez de uno por
// botón: como las filas se recrean cada vez que se llama a mostrarEliminar(),
// un listener puesto directo en cada botón se perdería al redibujar la
// tabla. El <tbody> nunca se destruye, así que el listener sobrevive.
tablaEliminar.addEventListener("click", async function (evento) {
  if (evento.target.tagName !== "BUTTON") {
    return;
  }

  const id = Number(evento.target.dataset.id);
  const plato = platos.find((p) => p.id === id);

  const confirmado = confirm(`¿Seguro que quieres eliminar "${plato.nombre}"?`);
  if (!confirmado) {
    return;
  }

  const seElimino = await eliminarPlato(id);
  if (!seElimino) {
    alert("No se pudo eliminar el plato. Revisa la consola.");
    return;
  }

  await recargarPlatos();
});

// UPDATE: el <select> se llena con un <option> por plato (value = id del
// plato). Elegir una opción precarga el formulario con los datos actuales;
// enviar el formulario confirma y manda a Supabase solo ese plato.
function mostrarOpcionesEditar() {
  const seleccionado = selectEditar.value; // para no perder la selección al refrescar
  selectEditar.innerHTML = "";

  platos.forEach((plato) => {
    const opcion = document.createElement("option");
    opcion.value = plato.id;
    opcion.textContent = plato.nombre;
    selectEditar.appendChild(opcion);
  });

  if (seleccionado && platos.some((p) => String(p.id) === seleccionado)) {
    selectEditar.value = seleccionado;
  }
}

// Llena los demás campos del form con los datos del plato elegido. Se llama
// al cambiar el select y después de cada recarga.
function cargarPlatoEnFormulario() {
  const plato = platos.find((p) => p.id === Number(selectEditar.value));

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

formEditar.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const id = Number(selectEditar.value);
  const platoActual = platos.find((p) => p.id === id);

  if (!platoActual) {
    return;
  }

  const confirmado = confirm(`¿Guardar los cambios de "${platoActual.nombre}"?`);
  if (!confirmado) {
    return;
  }

  // modificarPlato manda solo los campos del formulario; el id y la foto
  // (imagen) que ya tenía el plato quedan intactos.
  const actualizado = await modificarPlato(id, leerFormulario(formEditar));
  if (!actualizado) {
    alert("No se pudo guardar el cambio. Revisa la consola.");
    return;
  }

  await recargarPlatos();
});

recargarPlatos();

// PLAYERS: solo lectura. game.js guarda la lista de jugadores como texto JSON
// en localStorage (clave "usuariosJuego"); acá se lee con JSON.parse y se
// pinta una fila por jugador. La clave se muestra en texto plano solo porque
// es un ejercicio didáctico: en una app real nunca se guarda ni se muestra así.
const CLAVE_STORAGE_USUARIOS = "usuariosJuego";
const tablaJugadores = document.getElementById("tabla-jugadores");
const jugadoresResumen = document.getElementById("jugadores-resumen");

function leerJugadores() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE_USUARIOS)) || [];
  } catch (error) {
    return []; // JSON dañado: se trata como lista vacía
  }
}

// Los segundos se muestran como m:ss (ej. 95 → "1:35"); null significa que
// el jugador todavía no terminó ninguna partida.
function formatearTiempo(segundos) {
  if (segundos === null || segundos === undefined) {
    return "—";
  }
  return Math.floor(segundos / 60) + ":" + String(segundos % 60).padStart(2, "0");
}

function mostrarJugadores() {
  const jugadores = leerJugadores();
  tablaJugadores.innerHTML = "";

  jugadoresResumen.textContent = jugadores.length === 0
    ? "Todavía no se ha registrado ningún jugador."
    : jugadores.length + " jugador(es) registrado(s). Puntaje, intentos y tiempo son de su mejor partida.";

  jugadores.forEach((jugador) => {
    const fila = document.createElement("tr");

    // ?? usa el valor de la derecha solo si el de la izquierda es null o
    // undefined: sirve para jugadores registrados antes de que existieran
    // estas columnas, que no tienen esas propiedades.
    const valores = [
      jugador.name,
      jugador.email,
      jugador.password ?? "—",
      jugador.bestScore ?? "—",
      jugador.bestMoves ?? "—",
      formatearTiempo(jugador.bestTime),
      jugador.logins ?? 0,
    ];

    valores.forEach((valor, posicion) => {
      const celda = document.createElement("td");
      celda.textContent = valor; // textContent: un nombre con HTML no se interpreta
      if (posicion === 2) {
        celda.className = "gestion-hash";
      }
      fila.appendChild(celda);
    });

    tablaJugadores.appendChild(fila);
  });
}

mostrarJugadores();

// Se vuelve a leer al entrar a la pestaña (por si el juego cambió los datos
// mientras esta página estaba abierta) y cuando otra pestaña del navegador
// modifica localStorage (el evento "storage" solo se dispara en las OTRAS pestañas).
window.addEventListener("hashchange", function () {
  if (location.hash === "#jugadores") {
    mostrarJugadores();
  }
});
window.addEventListener("storage", function (evento) {
  if (evento.key === CLAVE_STORAGE_USUARIOS) {
    mostrarJugadores();
  }
});
