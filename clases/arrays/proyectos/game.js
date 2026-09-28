const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const totalPairsEl = document.getElementById("total-pairs");
const winEl = document.getElementById("win");
const restartBtn = document.getElementById("restart");
const playerEl = document.getElementById("player");
const confettiEl = document.getElementById("confetti");

// ---------- Datos ----------
// game.html borró la clave del localStorage antes de cargar data.js, así que
// platosColombia trae los objetos originales. guardarPlatos() (de data.js) los
// vuelve a escribir en el storage: queda purgado y recargado desde data.js.
guardarPlatos();

// Solo se usan los 8 primeros platos: 8 platos x 2 copias = 16 cartas.
const dishes = platosColombia.slice(0, 8);

// ---------- Estado del juego ----------
let firstCard = null;
let secondCard = null;
// lockBoard bloquea los clics mientras hay dos cartas abiertas esperando a
// resolverse; sin esto se podría abrir una tercera y el estado se rompería.
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
// El cronómetro arranca con la PRIMERA carta volteada (no al cargar el tablero),
// para que el tiempo mida cuánto tarda en jugar y no cuánto tarda en decidirse a empezar.
let startTime = null;
// Correo del jugador con sesión; sirve para saber a quién asignarle el puntaje al ganar.
let currentEmail = null;

// Fisher-Yates: recorre de atrás hacia adelante e intercambia cada posición
// con otra al azar entre 0 e i. Da la misma probabilidad a toda combinación
// (sort(() => Math.random() - 0.5) no lo garantiza).
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(dish, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  // --i escalona la animación de entrada (delay = i * 45ms), así las cartas
  // "se reparten" una tras otra en vez de aparecer todas juntas.
  card.style.setProperty("--i", index);
  // dataset.name identifica la pareja: dos cartas coinciden si comparten nombre.
  card.dataset.name = dish.nombre;
  card.setAttribute("aria-label", "Carta boca abajo");

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const back = document.createElement("div");
  back.className = "card-face card-back";
  const medallion = document.createElement("div");
  medallion.className = "medallion";
  medallion.textContent = "☕";
  back.append(medallion);

  const front = document.createElement("div");
  front.className = "card-face card-front";
  const img = document.createElement("img");
  img.src = imagenesConocidas[dish.nombre] || "";
  img.alt = dish.nombre;
  const caption = document.createElement("div");
  caption.className = "card-caption";
  const name = document.createElement("b");
  name.textContent = dish.nombre;
  const region = document.createElement("small");
  region.textContent = dish.region;
  caption.append(name, region);
  front.append(img, caption);

  inner.append(back, front);
  card.append(inner);
  card.addEventListener("click", () => flipCard(card));
  return card;
}

// Reinicia la animación "bump" del contador: se quita la clase, se fuerza un
// reflow (offsetWidth) y se vuelve a poner; sin el reflow el navegador
// fusionaría los dos cambios y no reproduciría la animación.
function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  if (startTime === null) startTime = Date.now();
  card.classList.add("flipped");
  card.setAttribute("aria-label", "Carta: " + card.dataset.name);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;
  bump(movesEl);
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    pairsEl.textContent = matchedPairs;
    bump(pairsEl);
    resetTurn();
    if (matchedPairs === dishes.length) win();
    return;
  }

  lockBoard = true;
  const a = firstCard;
  const b = secondCard;
  // Primero termina el giro (0.6s), luego tiembla y al final se voltean de nuevo.
  setTimeout(() => { a.classList.add("shake"); b.classList.add("shake"); }, 650);
  setTimeout(() => {
    [a, b].forEach((c) => {
      c.classList.remove("flipped", "shake");
      c.setAttribute("aria-label", "Carta boca abajo");
    });
    resetTurn();
  }, 1200);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Puntaje: 1000 puntos base, -20 por cada movimiento por encima del mínimo posible
// (8 movimientos = una pareja por intento) y -2 por cada segundo. Nunca baja de 0.
function calculateScore(moveCount, seconds) {
  const extraMoves = Math.max(0, moveCount - dishes.length);
  return Math.max(0, 1000 - extraMoves * 20 - seconds * 2);
}

function win() {
  const seconds = Math.round((Date.now() - startTime) / 1000);
  const score = calculateScore(moves, seconds);
  const isRecord = saveResult(score, moves, seconds);

  winEl.textContent = "¡Lo lograste en " + moves + " movimientos y " + seconds + " s! Puntaje: " + score +
    (isRecord ? " — ¡nuevo récord!" : "");
  winEl.classList.add("show");
  launchConfetti();
}

// Confeti en CSS puro: cada pieza es un <i> con color, posición y duración
// aleatorios (pasados como variables CSS) que cae con @keyframes y se elimina.
function launchConfetti() {
  const colors = ["#FCD116", "#003893", "#CE1126"];
  confettiEl.innerHTML = "";
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("i");
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % 3];
    piece.style.setProperty("--dur", 2.2 + Math.random() * 2 + "s");
    piece.style.setProperty("--delay", Math.random() * 0.8 + "s");
    confettiEl.append(piece);
  }
  setTimeout(() => { confettiEl.innerHTML = ""; }, 5000);
}

function startGame() {
  moves = 0;
  matchedPairs = 0;
  startTime = null;
  movesEl.textContent = 0;
  pairsEl.textContent = 0;
  totalPairsEl.textContent = dishes.length;
  winEl.classList.remove("show");
  confettiEl.innerHTML = "";
  resetTurn();

  boardEl.innerHTML = "";
  // Cada plato entra dos veces: [...dishes, ...dishes] forma las parejas.
  shuffle([...dishes, ...dishes]).forEach((dish, i) => boardEl.append(createCard(dish, i)));
}

restartBtn.addEventListener("click", () => {
  if (signupEl.open) return;
  startGame();
});

// ---------- Modal de registro ----------
const signupEl = document.getElementById("signup");
const formEl = document.getElementById("signup-form");
const pwToggle = document.getElementById("pw-toggle");

const nameInput = formEl.elements.name;
const emailInput = formEl.elements.email;
const passwordInput = formEl.elements.password;

// Contraseña: mínimo 8 caracteres, al menos 3 dígitos, 1 mayúscula y 1 símbolo.
// Cada (?=...) es un "lookahead": mira hacia adelante sin consumir texto, así
// varias condiciones se comprueban sobre la misma cadena a la vez.
//   (?=(?:.*\d){3})        → hay al menos 3 dígitos (en cualquier posición)
//   (?=.*[A-Z])            → hay al menos 1 mayúscula
//   (?=.*[^A-Za-z0-9\s])   → hay al menos 1 símbolo (ni letra, ni número, ni espacio)
//   .{8,}                  → largo total de 8 o más
const PASSWORD_REGEX = /^(?=(?:.*\d){3})(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}$/;

// Las mismas reglas por separado, para marcar en vivo cuál falta.
const passwordRules = {
  length: (v) => v.length >= 8,
  digits: (v) => (v.match(/\d/g) || []).length >= 3,
  upper: (v) => /[A-Z]/.test(v),
  symbol: (v) => /[^A-Za-z0-9\s]/.test(v),
};

function setError(input, message) {
  const field = input.closest(".field");
  field.classList.toggle("invalid", Boolean(message));
  field.querySelector("[data-error]").textContent = message;
}

const pwMeter = document.getElementById("pw-meter");
const pwStatus = document.getElementById("pw-status");

// Se ejecuta en cada tecla (evento "input"): recalcula qué reglas se cumplen,
// llena la barra y comprueba la regex completa, que es la que decide si es válida.
function updatePasswordRules() {
  const value = passwordInput.value;
  let passed = 0;

  document.querySelectorAll("[data-rule]").forEach((li) => {
    const ok = passwordRules[li.dataset.rule](value);
    const wasOk = li.classList.contains("ok");
    li.classList.toggle("ok", ok);
    if (ok) passed++;
    // La animación solo corre en el momento en que la regla pasa de no cumplida a cumplida.
    if (ok && !wasOk) {
      li.classList.remove("pop");
      void li.offsetWidth;
      li.classList.add("pop");
    }
  });

  pwMeter.dataset.level = passed;

  const field = passwordInput.closest(".field");
  const valid = PASSWORD_REGEX.test(value);
  field.classList.toggle("valid", valid);
  if (valid) field.classList.remove("invalid");

  pwStatus.classList.toggle("good", valid);
  pwStatus.textContent = valid
    ? "✓ Contraseña válida"
    : value ? "Faltan " + (4 - passed) + " regla(s)" : "";
}

function validateForm() {
  let valid = true;

  if (nameInput.value.trim().length < 2) {
    setError(nameInput, "Escribe tu nombre (mínimo 2 letras).");
    valid = false;
  } else setError(nameInput, "");

  if (!emailInput.checkValidity() || emailInput.value.trim() === "") {
    setError(emailInput, "Escribe un correo válido.");
    valid = false;
  } else setError(emailInput, "");

  if (!PASSWORD_REGEX.test(passwordInput.value)) {
    setError(passwordInput, "La contraseña no cumple todas las reglas.");
    valid = false;
  } else setError(passwordInput, "");

  return valid;
}

passwordInput.addEventListener("input", updatePasswordRules);
pwToggle.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  pwToggle.textContent = hidden ? "Ocultar" : "Ver";
});

// Esc cerraría el <dialog> por defecto; se cancela porque el juego no debe
// arrancar sin registro.
signupEl.addEventListener("cancel", (e) => e.preventDefault());

// ---------- Registro de usuarios (JSON en localStorage) ----------
// localStorage solo guarda strings: la lista de usuarios vive como un texto JSON
// (JSON.stringify al guardar, JSON.parse al leer), igual que hace data.js con los platos.
// No lo toca la purga de arriba: esa solo borra la clave de los platos.
const CLAVE_STORAGE_USUARIOS = "usuariosJuego";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE_USUARIOS)) || [];
  } catch (err) {
    return []; // JSON dañado: se trata como lista vacía en vez de romper el juego
  }
}

function saveUsers(users) {
  localStorage.setItem(CLAVE_STORAGE_USUARIOS, JSON.stringify(users, null, 2));
}

// DIDÁCTICO: la contraseña se guarda tal cual, en texto plano, para poder verla en la
// pestaña Jugadores de gestion.html. En una app real NUNCA se hace así: cualquiera que abra
// las DevTools del navegador la lee. Lo correcto es guardar solo un hash en un servidor.

// Diálogo de confirmación propio (en vez de window.confirm) para que combine con el diseño.
// Devuelve una Promise: se resuelve en true/false según el botón que se pulse.
const confirmEl = document.getElementById("confirm-reg");
function confirmRegistration(email) {
  document.getElementById("confirm-email").textContent = email;
  return new Promise((resolve) => {
    const finish = (answer) => {
      confirmEl.close();
      resolve(answer);
    };
    document.getElementById("confirm-yes").onclick = () => finish(true);
    document.getElementById("confirm-no").onclick = () => finish(false);
    confirmEl.oncancel = (e) => { e.preventDefault(); finish(false); }; // Esc = cancelar
    confirmEl.showModal();
  });
}

// Guarda el resultado de una partida ganada en el registro del jugador actual.
// Solo se conserva la MEJOR partida (mayor puntaje): puntaje, intentos y tiempo
// siempre pertenecen a la misma partida, así la fila de gestion.html es coherente.
// Devuelve true si fue un récord nuevo.
function saveResult(score, moveCount, seconds) {
  const users = loadUsers();
  const user = users.find((u) => u.email === currentEmail);
  if (!user) return false;

  const isRecord = user.bestScore === undefined || user.bestScore === null || score > user.bestScore;
  if (isRecord) {
    user.bestScore = score;
    user.bestMoves = moveCount;
    user.bestTime = seconds;
    saveUsers(users);
  }
  return isRecord;
}

function enterGame(user) {
  currentEmail = user.email;
  playerEl.replaceChildren("Jugador: ");
  const strong = document.createElement("strong");
  strong.textContent = user.name; // textContent: el nombre nunca se interpreta como HTML
  playerEl.append(strong);
  signupEl.close();
  startGame();
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const users = loadUsers();
  const existing = users.find((u) => u.email === email);

  // Caso 1: ya está registrado → login. Si la clave coincide, se cierra el modal y arranca.
  // Un registro viejo sin `password` (de cuando se guardaba el hash) no se puede verificar:
  // cae al caso 2 y se completa con los datos nuevos, conservando su puntaje e ingresos.
  if (existing && existing.password !== undefined) {
    if (existing.password !== password) {
      setError(passwordInput, "Contraseña incorrecta para este correo.");
      return;
    }
    existing.logins = (existing.logins || 0) + 1; // contador de ingresos
    saveUsers(users);
    enterGame(existing); // se muestra el nombre guardado, no el que se escribió ahora
    return;
  }

  // Caso 2: no está registrado → se pide confirmar antes de crear la cuenta.
  const wantsToRegister = await confirmRegistration(email);
  if (!wantsToRegister) return; // vuelve al modal sin guardar nada

  if (existing) {
    existing.name = nameInput.value.trim();
    existing.password = password;
    delete existing.passwordHash;
    existing.logins = (existing.logins || 0) + 1;
    saveUsers(users);
    enterGame(existing);
    return;
  }

  const newUser = {
    name: nameInput.value.trim(),
    email,
    password,
    registeredAt: new Date().toISOString(),
    logins: 1, // registrarse cuenta como el primer ingreso
    bestScore: null,
    bestMoves: null,
    bestTime: null,
  };
  users.push(newUser);
  saveUsers(users);
  enterGame(newUser);
});

signupEl.showModal();
nameInput.focus();
