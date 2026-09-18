let platosColombia = [
  {
    nombre: "Bandeja Paisa",
    region: "Antioquia",
    tiempoPreparacionMin: 90,
    esVegetariano: false,
    descripcionBreve: "Plato contundente con frijoles, arroz, carnes y arepa, símbolo de la gastronomía antioqueña.",
    saboresDominantes: ["Salado", "Ahumado"],
    bebidaTradicional: "Jugo de lulo"
  },
  {
    nombre: "Ajiaco Santafereño",
    region: "Bogotá / Cundinamarca",
    tiempoPreparacionMin: 75,
    esVegetariano: false,
    descripcionBreve: "Sopa cremosa de pollo y tres tipos de papa, perfumada con guascas.",
    saboresDominantes: ["Herbal", "Cremoso"],
    bebidaTradicional: "Chocolate caliente"
  },
  {
    nombre: "Arepa de Choclo",
    region: "Eje Cafetero",
    tiempoPreparacionMin: 30,
    esVegetariano: true,
    descripcionBreve: "Arepa dulce de maíz tierno rellena de queso, típica del desayuno cafetero.",
    saboresDominantes: ["Dulce", "Suave"],
    bebidaTradicional: "Café"
  },
  {
    nombre: "Sancocho de Gallina",
    region: "Valle del Cauca",
    tiempoPreparacionMin: 120,
    esVegetariano: false,
    descripcionBreve: "Caldo espeso de gallina con yuca, plátano y mazorca, plato de reunión familiar.",
    saboresDominantes: ["Especiado", "Reconfortante"],
    bebidaTradicional: "Limonada de panela"
  },
  {
    nombre: "Lechona Tolimense",
    region: "Tolima",
    tiempoPreparacionMin: 480,
    esVegetariano: false,
    descripcionBreve: "Cerdo relleno de arroz y arveja, horneado por horas hasta quedar crocante.",
    saboresDominantes: ["Crocante", "Sabroso"],
    bebidaTradicional: "Cerveza artesanal"
  },
  {
    nombre: "Tamal Tolimense",
    region: "Tolima / Huila",
    tiempoPreparacionMin: 240,
    esVegetariano: false,
    descripcionBreve: "Masa de maíz envuelta en hoja de plátano, rellena de carnes y verduras.",
    saboresDominantes: ["Terroso", "Suave"],
    bebidaTradicional: "Chocolate santafereño"
  },
  {
    nombre: "Buñuelo",
    region: "Nacional",
    tiempoPreparacionMin: 45,
    esVegetariano: true,
    descripcionBreve: "Bola frita de queso costeño, infaltable en la mesa navideña.",
    saboresDominantes: ["Salado", "Crocante"],
    bebidaTradicional: "Natilla"
  },
  {
    nombre: "Arequipe",
    region: "Nacional",
    tiempoPreparacionMin: 60,
    esVegetariano: true,
    descripcionBreve: "Dulce de leche espeso y caramelizado, base de postres y acompañante de frutas.",
    saboresDominantes: ["Dulce", "Cremoso"],
    bebidaTradicional: "Café con leche"
  }
];

// fotos libres de Wikimedia Commons, indexadas por nombre del plato
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

function crearImagenPlaceholder(plato) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='190'>
    <rect width='100%' height='100%' fill='#f3e9d2'/>
    <text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='#4a4a4a' text-anchor='middle' dominant-baseline='middle'>${plato.nombre}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const inventarioEl = document.getElementById("inventario");
const plantillaPlato = document.getElementById("plato-template");

platosColombia.forEach((plato, indice) => {
  const carta = plantillaPlato.content.cloneNode(true);

  carta.querySelector(".js-nombre").textContent = plato.nombre;
  carta.querySelector(".js-region").textContent = plato.region;

  const vegEl = carta.querySelector(".js-vegetariano");
  vegEl.textContent = plato.esVegetariano ? "Vegetariano" : "Con carne";
  vegEl.classList.toggle("food-veg-tag--carne", !plato.esVegetariano);

  const imagenEl = carta.querySelector(".js-imagen");
  imagenEl.alt = plato.nombre;
  imagenEl.src = imagenesConocidas[plato.nombre] || crearImagenPlaceholder(plato);
  imagenEl.onerror = () => {
    imagenEl.onerror = null;
    imagenEl.src = crearImagenPlaceholder(plato);
  };

  carta.querySelector(".js-tiempo").textContent = `${plato.tiempoPreparacionMin} min`;
  carta.querySelector(".js-sabores").textContent = plato.saboresDominantes.join(", ");
  carta.querySelector(".js-region-hover").textContent = plato.region;
  carta.querySelector(".js-bebida").textContent = plato.bebidaTradicional;

  carta.querySelector(".js-descripcion").textContent = plato.descripcionBreve;

  carta.querySelector(".js-numero").textContent =
    `N.º ${String(indice + 1).padStart(3, "0")}`;

  inventarioEl.appendChild(carta);
});
