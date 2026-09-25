const inventarioEl = document.getElementById("inventario");
const plantillaPlato = document.getElementById("plato-template");

// Aquí pasa el renderizado real: por cada plato del array clonamos la
// plantilla del HTML (el <template>, que no se ve en pantalla) y llenamos
// sus huecos (.js-*) con los datos de ese plato. El HTML nunca tiene
// tarjetas escritas a mano — todas nacen de este bucle.
// platosColombia e imagenesConocidas viven en data.js, que se carga antes.
platosColombia.forEach((plato) => {
  const carta = plantillaPlato.content.cloneNode(true);

  carta.querySelector(".js-nombre").textContent = plato.nombre;
  // El nombre se repite en la cara de atrás como título, para que al girar
  // la tarjeta se sepa de qué plato son los datos.
  carta.querySelector(".js-nombre-back").textContent = plato.nombre;

  // Región y tipo de plato ahora viven en la cara de atrás. El booleano
  // esVegetariano decide tres cosas a la vez: el texto, el ícono (hoja o
  // presa de carne) y el color del círculo (azul = vegetariano, rojo = con
  // carne), así el dato no solo se lee, también se ve.
  carta.querySelector(".js-region").textContent = plato.region;
  carta.querySelector(".js-dieta").textContent =
    plato.esVegetariano ? "Vegetariano" : "Contiene carne";
  // Se usa toggleAttribute y no la propiedad .hidden porque los <svg> no
  // tienen esa propiedad (es solo de elementos HTML): asignarla no haría nada.
  carta.querySelector(".js-icono-veg").toggleAttribute("hidden", !plato.esVegetariano);
  carta.querySelector(".js-icono-carne").toggleAttribute("hidden", plato.esVegetariano);
  carta.querySelector(".js-dieta-item").classList.toggle("food-hover-item--carne", !plato.esVegetariano);

  // La foto se busca por nombre en imagenesConocidas; el alt describe la
  // imagen para lectores de pantalla y aparece si la foto no llega a cargar.
  const imagenEl = carta.querySelector(".js-imagen");
  imagenEl.alt = plato.nombre;
  imagenEl.src = imagenesConocidas[plato.nombre];

  // Tiempo y sabores también van en la cara de atrás (visible al girar la
  // tarjeta con el hover), en elementos aparte de los del frente.
  carta.querySelector(".js-tiempo").textContent = `${plato.tiempoPreparacionMin} min`;
  carta.querySelector(".js-sabores").textContent = plato.saboresDominantes.join(", ");

  carta.querySelector(".js-descripcion").textContent = plato.descripcionBreve;

  // El clic para abrir el modal va en .food-card (la tarjeta completa), no en
  // un elemento suelto: así cualquier parte de la tarjeta (frente o dorso)
  // responde igual. Se agrega acá, antes del appendChild, porque "plato" solo
  // existe dentro de esta vuelta del forEach — es el cierre (closure) el que
  // permite que el listener recuerde a qué plato exacto corresponde esta
  // tarjeta cuando se haga clic, más adelante en el tiempo.
  carta.querySelector(".food-card").addEventListener("click", () => abrirModal(plato));

  inventarioEl.appendChild(carta);
});

// ----- Modal de detalle -----
const modal = document.getElementById("modal-plato");
const modalCerrar = document.getElementById("modal-cerrar");

function abrirModal(plato) {
  document.getElementById("modal-nombre").textContent = plato.nombre;
  document.getElementById("modal-region").textContent = plato.region;
  document.getElementById("modal-tiempo").textContent = `${plato.tiempoPreparacionMin} min`;
  document.getElementById("modal-dieta").textContent =
    plato.esVegetariano ? "Vegetariano" : "Contiene carne";
  document.getElementById("modal-sabores").textContent = plato.saboresDominantes.join(", ");
  document.getElementById("modal-descripcion").textContent = plato.descripcionBreve;

  const modalImagen = document.getElementById("modal-imagen");
  modalImagen.src = imagenesConocidas[plato.nombre];
  modalImagen.alt = plato.nombre;

  // Sacar el atributo hidden es lo que realmente muestra el modal; el CSS
  // se encarga de centrarlo y oscurecer el fondo cuando no tiene hidden.
  modal.hidden = false;
}

function cerrarModal() {
  modal.hidden = true;
}

modalCerrar.addEventListener("click", cerrarModal);

// Clic en el fondo oscuro (fuera de la caja blanca) también cierra. Se
// compara evento.target con modal (el overlay) y no con la caja interna,
// así un clic dentro de la caja no dispara el cierre por accidente.
modal.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    cerrarModal();
  }
});

// Cerrar con la tecla Escape es una convención estándar de accesibilidad
// para cualquier modal/diálogo.
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !modal.hidden) {
    cerrarModal();
  }
});
