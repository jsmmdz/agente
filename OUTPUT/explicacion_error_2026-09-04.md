# Explicación de error — 2026-09-04

## Contexto
`INPUT/clases/1.html` tiene un botón (`<button id="myButton">`). `INPUT/clases/script.js` agrega un listener de `click` que intenta escribir texto en un elemento con `id="demo"`, pero ese elemento no existe en el HTML.

## Código con el problema
```js
const item = document.getElementById('demo');

const myButton = document.getElementById('myButton');

myButton.addEventListener('click', () => {
  item.textContent = 'Hola mundo';
});
```

## Tipo de error
`TypeError: Cannot set properties of null (setting 'textContent')`. Es un error de tipo — el código intenta usar un valor (`null`) como si fuera un objeto con propiedades, cuando en realidad `null` significa "no encontré nada".

## Causa puntual
`document.getElementById('demo')` busca en el HTML un elemento cuyo `id` sea `demo`. Como `1.html` no tiene ningún elemento con ese `id`, el método devuelve `null` (no lanza error en ese momento — simplemente no encuentra nada). El error recién aparece más tarde, al hacer click, cuando la línea `item.textContent = 'Hola mundo'` intenta modificar una propiedad de `item`, y `item` es `null`.

## Concepto detrás
`getElementById` nunca falla por sí solo: si no encuentra el `id`, devuelve `null` en silencio. El error se revela recién en el momento en que *usás* ese valor como si fuera un elemento real. Por eso el mensaje de error apunta a la línea del click y no a la línea de la búsqueda — hay que rastrear hacia atrás de dónde vino ese `null`. Esta es una fuente muy común de bugs en JS: un `id` que no coincide entre el HTML y el JS (por un typo, o porque el elemento nunca se creó).

## Corrección
Dos caminos válidos, según qué se quiera lograr:

1. Si el objetivo es mostrar "Hola mundo" en algún lugar de la página, agregar el elemento faltante en `1.html`:
   ```html
   <p id="demo"></p>
   ```
2. Si el objetivo era modificar el propio botón, usar `myButton` en vez de `item`:
   ```js
   myButton.addEventListener('click', () => {
     myButton.textContent = 'Hola mundo';
   });
   ```

## Estrategia de acompañamiento
Se guio la revisión mostrando que `getElementById` no lanza error al no encontrar nada — devuelve `null` — para que la próxima vez el estudiante sepa rastrear un `TypeError: Cannot set properties of null` hacia la búsqueda de `id` que lo originó, en vez de mirar solo la línea que señala el mensaje.
