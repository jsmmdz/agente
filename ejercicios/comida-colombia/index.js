// Array de objetos: cada plato es un objeto con las mismas 6 propiedades,
// así el forEach de más abajo puede tratarlos todos igual sin importar cuál sea.
// Tipos de dato representados: texto (nombre, region, descripcionBreve),
// número (tiempoPreparacionMin), booleano (esVegetariano) y array (saboresDominantes).
let platosColombia = [
  {
    nombre: "Bandeja Paisa",
    region: "Antioquia",
    tiempoPreparacionMin: 90,
    esVegetariano: false,
    descripcionBreve: "Plato contundente con frijoles, arroz, carnes y arepa, símbolo de la gastronomía antioqueña.",
    saboresDominantes: ["Salado", "Ahumado"],
  },
  {
    nombre: "Ajiaco Santafereño",
    region: "Bogotá / Cundinamarca",
    tiempoPreparacionMin: 75,
    esVegetariano: false,
    descripcionBreve: "Sopa cremosa de pollo y tres tipos de papa, perfumada con guascas.",
    saboresDominantes: ["Herbal", "Cremoso"],
  },
  {
    nombre: "Arepa de Choclo",
    region: "Eje Cafetero",
    tiempoPreparacionMin: 30,
    esVegetariano: true,
    descripcionBreve: "Arepa dulce de maíz tierno rellena de queso, típica del desayuno cafetero.",
    saboresDominantes: ["Dulce", "Suave"],
  },
  {
    nombre: "Sancocho de Gallina",
    region: "Valle del Cauca",
    tiempoPreparacionMin: 120,
    esVegetariano: false,
    descripcionBreve: "Caldo espeso de gallina con yuca, plátano y mazorca, plato de reunión familiar.",
    saboresDominantes: ["Especiado", "Reconfortante"],
  },
  {
    nombre: "Lechona Tolimense",
    region: "Tolima",
    tiempoPreparacionMin: 480,
    esVegetariano: false,
    descripcionBreve: "Cerdo relleno de arroz y arveja, horneado por horas hasta quedar crocante.",
    saboresDominantes: ["Crocante", "Sabroso"],
  },
  {
    nombre: "Tamal Tolimense",
    region: "Tolima / Huila",
    tiempoPreparacionMin: 240,
    esVegetariano: false,
    descripcionBreve: "Masa de maíz envuelta en hoja de plátano, rellena de carnes y verduras.",
    saboresDominantes: ["Terroso", "Suave"],
  },
  {
    nombre: "Buñuelo",
    region: "Nacional",
    tiempoPreparacionMin: 45,
    esVegetariano: true,
    descripcionBreve: "Bola frita de queso costeño, infaltable en la mesa navideña.",
    saboresDominantes: ["Salado", "Crocante"],
  },
  {
    nombre: "Arequipe",
    region: "Nacional",
    tiempoPreparacionMin: 60,
    esVegetariano: true,
    descripcionBreve: "Dulce de leche espeso y caramelizado, base de postres y acompañante de frutas.",
    saboresDominantes: ["Dulce", "Cremoso"],
  }
];

// Mapa nombre → URL de foto. Se usa un objeto (no el array de arriba) porque
// acá buscamos por nombre exacto en vez de recorrer todo, es más directo.
const BASE_COMMONS = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const imagenesConocidas = {
  "Bandeja Paisa": BASE_COMMONS + "Bandeja_Paisa_-_Comida_tipica_colombiana.jpg",
  "Ajiaco Santafereño": BASE_COMMONS + "Ajiaco_in_Bogot%C3%A1.jpg",
  "Arepa de Choclo": BASE_COMMONS + "Arepa_de_chocolo.jpg",
  "Sancocho de Gallina": BASE_COMMONS + "Sancocho_de_gallina_criolla.jpg",
  "Lechona Tolimense": BASE_COMMONS + "Lechona.JPG",
  "Tamal Tolimense": BASE_COMMONS + "Tamal_tolimense_abierto.jpg",
  "Buñuelo": BASE_COMMONS + "Bu%C3%B1uelos_Colombianos_(24221303805).jpg",
  "Arequipe": BASE_COMMONS + "Breva_con_arequipe_2014-04-17_15-37.jpg"
};

// Si una foto real no carga (o el plato no tiene URL en imagenesConocidas),
// generamos una imagen de reemplazo al vuelo con el nombre del plato escrito
// dentro de un SVG. Así ninguna tarjeta se queda con un ícono roto.
function crearImagenPlaceholder(plato) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='190'>
    <rect width='100%' height='100%' fill='#f3e9d2'/>
    <text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='#4a4a4a' text-anchor='middle' dominant-baseline='middle'>${plato.nombre}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const inventarioEl = document.getElementById("inventario");
const plantillaPlato = document.getElementById("plato-template");

// Acá pasa el renderizado real: por cada plato del array clonamos la
// plantilla del HTML (el <template>, que no se ve en pantalla) y llenamos
// sus huecos (.js-*) con los datos de ese plato. El HTML nunca tiene
// tarjetas escritas a mano — todas nacen de este bucle.
platosColombia.forEach((plato, indice) => {
  const carta = plantillaPlato.content.cloneNode(true);

  carta.querySelector(".js-nombre").textContent = plato.nombre;
  carta.querySelector(".js-region").textContent = plato.region;

  // La etiqueta cambia de texto Y de color según el booleano esVegetariano:
  // así el dato no solo se lee, también se ve (azul = vegetariano, rojo = con carne).
  const vegEl = carta.querySelector(".js-vegetariano");
  vegEl.textContent = plato.esVegetariano ? "Vegetariano" : "Con carne";
  vegEl.classList.toggle("food-veg-tag--carne", !plato.esVegetariano);

  // Intentamos la foto real primero; si falla la carga (onerror), la
  // reemplazamos por el placeholder generado arriba.
  const imagenEl = carta.querySelector(".js-imagen");
  imagenEl.alt = plato.nombre;
  imagenEl.src = imagenesConocidas[plato.nombre] || crearImagenPlaceholder(plato);
  imagenEl.onerror = () => {
    imagenEl.onerror = null;
    imagenEl.src = crearImagenPlaceholder(plato);
  };

  // Estos cuatro datos solo se muestran en el hover (ver .food-hover en el CSS),
  // por eso van en elementos aparte de los que se ven siempre en la tarjeta.
  carta.querySelector(".js-tiempo").textContent = `${plato.tiempoPreparacionMin} min`;
  carta.querySelector(".js-sabores").textContent = plato.saboresDominantes.join(", ");
  carta.querySelector(".js-region-hover").textContent = plato.region;

  carta.querySelector(".js-descripcion").textContent = plato.descripcionBreve;

  // padStart rellena con ceros a la izquierda (1 -> "001") para que el
  // número de catálogo se vea parejo sin importar cuántos platos haya.
  carta.querySelector(".js-numero").textContent =
    `N.º ${String(indice + 1).padStart(3, "0")}`;

  inventarioEl.appendChild(carta);
});
