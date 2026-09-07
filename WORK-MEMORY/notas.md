# Notas de mi agente

Acá vive lo que ya decidimos juntos, para no repetirlo cada sesión: preferencias de
cómo organizo las cosas, criterios de prioridad, temas que sé que me cuestan.
El agente lee este archivo al inicio de cada sesión y lo va sumando con el tiempo.

## Dónde estoy trabajando
- Los ejercicios de clase de JavaScript viven en `INPUT/clases/`, numerados por clase
  (`1.html` + su `script.js`). Ahí practico manipulación del DOM.
- `INPUT/clases/script.js` tiene un error a propósito: es el material con el que
  practico, no hay que corregirlo salvo que lo pida.

## Temas que ya trabajé
- **2026-09-04** — `TypeError: Cannot set properties of null`. Lo importante que quedó:
  `getElementById` no falla cuando no encuentra el `id`, devuelve `null` en silencio,
  y el error recién aparece después, al usar ese `null`. O sea que hay que rastrear
  hacia atrás desde la línea que marca el error hasta la búsqueda que lo originó.
  Explicación completa en `OUTPUT/explicacion_error_2026-09-04.md`.

## Pendiente
- `INPUT/entregas_talleres.md` sigue vacío: falta cargar mis materias y fechas reales.
  Hasta que eso pase, la skill `organizar-entregas` no tiene con qué trabajar.
