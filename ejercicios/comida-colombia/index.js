let platosColombia = [
  {
    nombre: "Bandeja Paisa",
    region: "Antioquia",
    tiempoPreparacionMin: 90,
    esVegetariano: false,
    ingredientesPrincipales: ["Frijoles", "Arroz", "Chicharrón", "Arepa"],
    saboresDominantes: ["Salado", "Ahumado"],
    bebidaTradicional: "Jugo de lulo"
  },
  {
    nombre: "Ajiaco Santafereño",
    region: "Bogotá / Cundinamarca",
    tiempoPreparacionMin: 75,
    esVegetariano: false,
    ingredientesPrincipales: ["Pollo", "Papa criolla", "Guascas", "Mazorca"],
    saboresDominantes: ["Herbal", "Cremoso"],
    bebidaTradicional: "Chocolate caliente"
  },
  {
    nombre: "Arepa de Choclo",
    region: "Eje Cafetero",
    tiempoPreparacionMin: 30,
    esVegetariano: true,
    ingredientesPrincipales: ["Maíz tierno", "Queso", "Mantequilla"],
    saboresDominantes: ["Dulce", "Suave"],
    bebidaTradicional: "Café"
  },
  {
    nombre: "Sancocho de Gallina",
    region: "Valle del Cauca",
    tiempoPreparacionMin: 120,
    esVegetariano: false,
    ingredientesPrincipales: ["Gallina", "Yuca", "Plátano", "Mazorca"],
    saboresDominantes: ["Especiado", "Reconfortante"],
    bebidaTradicional: "Limonada de panela"
  },
  {
    nombre: "Lechona Tolimense",
    region: "Tolima",
    tiempoPreparacionMin: 480,
    esVegetariano: false,
    ingredientesPrincipales: ["Cerdo", "Arroz", "Arveja", "Especias"],
    saboresDominantes: ["Crocante", "Sabroso"],
    bebidaTradicional: "Cerveza artesanal"
  },
  {
    nombre: "Tamal Tolimense",
    region: "Tolima / Huila",
    tiempoPreparacionMin: 240,
    esVegetariano: false,
    ingredientesPrincipales: ["Masa de maíz", "Cerdo", "Pollo", "Hoja de plátano"],
    saboresDominantes: ["Terroso", "Suave"],
    bebidaTradicional: "Chocolate santafereño"
  },
  {
    nombre: "Buñuelo",
    region: "Nacional",
    tiempoPreparacionMin: 45,
    esVegetariano: true,
    ingredientesPrincipales: ["Queso costeño", "Almidón de yuca", "Huevo"],
    saboresDominantes: ["Salado", "Crocante"],
    bebidaTradicional: "Natilla"
  },
  {
    nombre: "Arequipe",
    region: "Nacional",
    tiempoPreparacionMin: 60,
    esVegetariano: true,
    ingredientesPrincipales: ["Leche", "Azúcar", "Bicarbonato"],
    saboresDominantes: ["Dulce", "Cremoso"],
    bebidaTradicional: "Café con leche"
  }
];

// imágenes que ya tenemos guardadas en la carpeta, indexadas por nombre del plato
const imagenesConocidas = {
  "Bandeja Paisa": "bandeja-paisa.jpg",
  "Ajiaco Santafereño": "ajiaco.jpg",
  "Arepa de Choclo": "arepa-choclo.jpg",
  "Sancocho de Gallina": "sancocho.jpg",
  "Lechona Tolimense": "lechona.jpg",
  "Tamal Tolimense": "tamal.jpg",
  "Buñuelo": "bunuelo.jpg",
  "Arequipe": "arequipe.jpg"
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
  carta.querySelector(".js-vegetariano").textContent = plato.esVegetariano
    ? "Vegetariano"
    : "Con carne";

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

  const ingredientesEl = carta.querySelector(".js-ingredientes");
  plato.ingredientesPrincipales.forEach((ingrediente) => {
    const li = document.createElement("li");
    li.textContent = ingrediente;
    ingredientesEl.appendChild(li);
  });

  carta.querySelector(".js-numero").textContent =
    `N.º ${String(indice + 1).padStart(3, "0")}`;

  inventarioEl.appendChild(carta);
});
