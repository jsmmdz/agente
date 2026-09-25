// Array de objetos: cada plato es un objeto con las mismas 6 propiedades,
// así el forEach de más abajo puede tratarlos todos igual sin importar cuál sea.
// Tipos de dato representados: texto (nombre, region, descripcionBreve),
// número (tiempoPreparacionMin), booleano (esVegetariano) y array (saboresDominantes)
const platosColombia = [
  {
    nombre: "Bandeja Paisa",
    region: "Antioquia",
    tiempoPreparacionMin: 90,
    esVegetariano: false,
    descripcionBreve: "Plato contundente con frijoles, arroz, carnes y arepa, símbolo de la gastronomía antioqueña.",
    saboresDominantes: ["Salado", "Ahumado", "Crocante"],
  },
  {
    nombre: "Ajiaco Santafereño",
    region: "Bogotá / Cundinamarca",
    tiempoPreparacionMin: 75,
    esVegetariano: false,
    descripcionBreve: "Sopa cremosa de pollo y tres tipos de papa, perfumada con guascas.",
    saboresDominantes: ["Herbal", "Cremoso", "Salino"],
  },
  {
    nombre: "Arepa de Choclo",
    region: "Eje Cafetero",
    tiempoPreparacionMin: 30,
    esVegetariano: true,
    descripcionBreve: "Arepa dulce de maíz tierno rellena de queso, típica del desayuno cafetero.",
    saboresDominantes: ["Dulce", "Salado", "Suave"],
  },
  {
    nombre: "Sancocho de Gallina",
    region: "Valle del Cauca",
    tiempoPreparacionMin: 120,
    esVegetariano: false,
    descripcionBreve: "Caldo espeso de gallina con yuca, plátano y mazorca, plato de reunión familiar.",
    saboresDominantes: ["Herbal", "Sustancioso", "Reconfortante"],
  },
  {
    nombre: "Lechona Tolimense",
    region: "Tolima",
    tiempoPreparacionMin: 480,
    esVegetariano: false,
    descripcionBreve: "Cerdo relleno de arroz y arveja, horneado por horas hasta quedar crocante.",
    saboresDominantes: ["Crocante", "Jugoso", "Especiado"],
  },
  {
    nombre: "Tamal Tolimense",
    region: "Tolima / Huila",
    tiempoPreparacionMin: 240,
    esVegetariano: false,
    descripcionBreve: "Masa de maíz envuelta en hoja de plátano, rellena de carnes y verduras.",
    saboresDominantes: ["Terroso", "Suave", "Aromático"],
  },
  {
    nombre: "Buñuelo",
    region: "Nacional",
    tiempoPreparacionMin: 45,
    esVegetariano: true,
    descripcionBreve: "Bola frita de queso costeño, infaltable en la mesa navideña.",
    saboresDominantes: ["Salado", "Crocante", "Esponjoso"],
  },
  {
    nombre: "Arequipe",
    region: "Nacional",
    tiempoPreparacionMin: 60,
    esVegetariano: true,
    descripcionBreve: "Dulce de leche espeso y caramelizado, base de postres y acompañante de frutas.",
    saboresDominantes: ["Dulce", "Cremoso", "Caramelizado"],
  }
];

// Mapa nombre → URL de foto. Se usa un objeto (no el array de arriba) porque
// aquí buscamos por nombre exacto en vez de recorrer todo, es más directo.
const BASE_COMMONS = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const imagenesConocidas = {
  "Bandeja Paisa": BASE_COMMONS + "Bandeja_Paisa_-_Comida_tipica_colombiana.jpg",
  "Ajiaco Santafereño": BASE_COMMONS + "Ajiaco_in_Bogot%C3%A1.jpg",
  "Arepa de Choclo": BASE_COMMONS + "Arepa_de_chocolo.jpg",
  "Sancocho de Gallina": BASE_COMMONS + "Sancocho_de_gallina_criolla.jpg",
  "Lechona Tolimense": BASE_COMMONS + "Lechona.JPG",
  "Tamal Tolimense": BASE_COMMONS + "Tamal_tolimense_abierto.jpg",
  "Buñuelo": BASE_COMMONS + "Bu%C3%B1uelos_Colombianos_(24221303805).jpg",
  // El arequipe usa una foto de Pinterest en vez de Commons: las de Commons
  // eran mal encuadradas o de empaques, y esta se ve más elegante. Al ser un
  // enlace público (no un archivo local) también funciona dentro de CodePen.
  "Arequipe": "https://i.pinimg.com/564x/b9/30/4f/b9304f3a1f2a396bd0bd7c3d2ddd4549.jpg"
};

// localStorage solo guarda strings, por eso los objetos/arrays se convierten
// con JSON.stringify al guardar y JSON.parse al leer. Es el mismo storage
// del navegador para cualquier página servida desde esta carpeta (mismo
// origen), así que sobrevive a recargas y se comparte entre index.html y
// gestion.html.
const CLAVE_STORAGE_PLATOS = "platosColombia";

function guardarPlatos() {
  localStorage.setItem(CLAVE_STORAGE_PLATOS, JSON.stringify(platosColombia));
}

// Si ya hay datos guardados de una sesión anterior, reemplazan a los platos
// de arriba. platosColombia queda como const: en vez de reasignarlo, se
// vacía (length = 0) y se rellena con push, así todo el código que ya
// apunta a este array (en script.js y gestion.js) sigue viendo los mismos
// datos actualizados sin tener que volver a declararlo.
const platosGuardados = localStorage.getItem(CLAVE_STORAGE_PLATOS);
if (platosGuardados) {
  platosColombia.length = 0;
  platosColombia.push(...JSON.parse(platosGuardados));
}
