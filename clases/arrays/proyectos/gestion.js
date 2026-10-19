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

// =============================================
// PLATOS: lógica de la interfaz (usa el objeto Datos de datos.js).
// Mismo patrón de pantalla: un solo formulario que sirve para crear y editar,
// buscador, mensajes de éxito/error y estado de la conexión.
// =============================================
const form = document.getElementById("form-plato");
const inputId = document.getElementById("plato-id");
const tituloFormulario = document.getElementById("titulo-formulario");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const tbody = document.getElementById("tabla-platos");
const buscador = document.getElementById("buscar");
const estado = document.getElementById("estado-conexion");
const mensaje = document.getElementById("mensaje");

// "platos" es una copia local de lo que hay en Supabase. Se vuelve a pedir
// (cargarPlatos) después de cada CREATE / UPDATE / DELETE, así la pantalla
// siempre refleja la base de datos real. Cada plato se identifica por su id
// (no por su posición en el array).
let platos = [];

// ---------- Utilidades ----------
function mostrarMensaje(texto, tipo = "ok") {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  mensaje.hidden = false;
  setTimeout(() => { mensaje.hidden = true; }, 3000);
}

// Convierte un texto en HTML seguro: un nombre como "<b>x</b>" se muestra tal
// cual en vez de interpretarse. Se usa porque la tabla se arma con innerHTML.
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function limpiarFormulario() {
  form.reset();
  inputId.value = "";
  tituloFormulario.textContent = "Crear plato";
  btnGuardar.textContent = "Guardar plato";
  btnCancelar.hidden = true;
}

// Lee el formulario y arma el objeto con la misma forma que las columnas de
// la tabla. No lleva id: Postgres lo genera al insertar.
function leerFormulario() {
  const datos = new FormData(form);
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

// ---------- Renderizado ----------
function renderizarTabla(lista) {
  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="vacio">No hay platos</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map((p) => `
    <tr>
      <td>${escaparHTML(p.nombre)}</td>
      <td>${escaparHTML(p.region)}</td>
      <td>${escaparHTML(String(p.tiempoPreparacionMin))}</td>
      <td>${p.esVegetariano ? "Sí" : "No"}</td>
      <td class="celda-acciones">
        <button type="button" data-id="${p.id}" data-accion="editar">Editar</button>
        <button type="button" class="gestion-btn-peligro" data-id="${p.id}" data-accion="eliminar">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

// Filtra la copia local (no consulta de nuevo a Supabase) por nombre, región
// o sabores, sin distinguir mayúsculas.
function filtrar() {
  const texto = buscador.value.trim().toLowerCase();
  const filtrados = platos.filter((p) =>
    [p.nombre, p.region, (p.saboresDominantes || []).join(" ")]
      .some((v) => (v || "").toLowerCase().includes(texto))
  );
  renderizarTabla(filtrados);
}

// ---------- Operaciones ----------
async function cargarPlatos() {
  try {
    platos = await Datos.listar();
    filtrar();
    estado.textContent = "● Conectado";
    estado.className = "estado conectado";
  } catch (err) {
    console.error(err);
    estado.textContent = "● Sin conexión";
    estado.className = "estado error";
    tbody.innerHTML = `<tr><td colspan="5" class="vacio">Error al cargar: ${escaparHTML(err.message)}</td></tr>`;
  }
}

async function guardar(evento) {
  // preventDefault evita que el navegador recargue la página al enviar el
  // formulario, que es el comportamiento por defecto de <form>.
  evento.preventDefault();

  const registro = leerFormulario();

  btnGuardar.disabled = true;
  try {
    if (inputId.value) {
      // Al editar solo se mandan los campos del formulario: el id y la foto
      // (imagen) que ya tenía el plato quedan intactos.
      await Datos.actualizar(inputId.value, registro);
      mostrarMensaje("Plato actualizado ✅");
    } else {
      await Datos.crear(registro);
      mostrarMensaje("Plato creado ✅");
    }
    limpiarFormulario();
    await cargarPlatos();
    location.hash = "#listar";
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error: " + err.message, "error");
  } finally {
    btnGuardar.disabled = false;
  }
}

// Carga el plato en el formulario único y salta al panel #crear.
function editar(id) {
  const p = platos.find((x) => String(x.id) === String(id));
  if (!p) return;

  inputId.value = p.id;
  form.nombre.value = p.nombre;
  form.region.value = p.region;
  form.tiempoPreparacionMin.value = p.tiempoPreparacionMin;
  form.esVegetariano.checked = p.esVegetariano;
  form.descripcionBreve.value = p.descripcionBreve;
  form.saboresDominantes.value = (p.saboresDominantes || []).join(", ");

  tituloFormulario.textContent = "Editar plato";
  btnGuardar.textContent = "Actualizar plato";
  btnCancelar.hidden = false;
  location.hash = "#crear";
  form.nombre.focus();
}

async function eliminar(id) {
  const p = platos.find((x) => String(x.id) === String(id));
  if (!confirm(`¿Seguro que quieres eliminar "${p ? p.nombre : "este plato"}"?`)) return;

  try {
    await Datos.eliminar(id);
    mostrarMensaje("Plato eliminado 🗑️");
    if (inputId.value === String(id)) limpiarFormulario();
    await cargarPlatos();
  } catch (err) {
    console.error(err);
    mostrarMensaje("Error: " + err.message, "error");
  }
}

// ---------- Eventos ----------
form.addEventListener("submit", guardar);
btnCancelar.addEventListener("click", limpiarFormulario);
buscador.addEventListener("input", filtrar);

// Un solo listener en el <tbody> (delegación de eventos): las filas se
// recrean cada vez que se llama a renderizarTabla(), y un listener puesto
// directo en cada botón se perdería. El <tbody> nunca se destruye.
tbody.addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-accion]");
  if (!boton) return;
  const { id, accion } = boton.dataset;
  if (accion === "editar") editar(id);
  if (accion === "eliminar") eliminar(id);
});

cargarPlatos();

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
