# Bitácora de reflexiones

Una entrada breve por sesión: qué aprendí o qué me costó más, escrita al cierre.
La agrega el agente cuando pregunta al final de cada sesión, con encabezado de fecha
(`## AAAA-MM-DD`), la más reciente arriba.

Todavía sin entradas — se llena sola a medida que trabajemos.

## 2026-09-19

**Exploración de estilo pedida por la entrega de objetos/arrays** (catálogo
"Sabores de Colombia"): antes de quedarme con el overlay de hover que ya
tenía, probé una variante de tarjeta con flip 3D (`transform: rotateY(180deg)`
sobre un `.food-flipper` con `perspective` en el padre y `backface-visibility:
hidden` en cada cara) — la cara trasera muestra tiempo, sabores y región, la
delantera la imagen y el resto de datos.

Resultado: el flip se ve bien y cumple el pedido de explorar transforms
distintos al `translateY` que ya usaba, pero tiene dos costos que el overlay
no tiene — necesita una altura fija en `.food-card` (con descripciones más
largas se arriesga a recortar contenido) y esconde por completo el nombre del
plato mientras está volteada, lo que se siente menos legible para un catálogo
que se recorre rápido. Decisión: me quedo con el overlay (`opacity` + `inset:
0`, altura automática), pero dejo la variante de flip como alternativa válida
si en algún momento quiero una versión con menos texto por tarjeta.

Lo que más me costó hoy fue la presión de tiempo: con la entrega a una hora,
prioricé cerrar primero lo que el rubric pedía como obligatorio (breakpoints,
comentarios explicando el porqué de cada bloque) y dejé la exploración de
estilo para el final, documentándola aunque no cambié el CSS final — tal como
pide la consigna.

**Actualización, misma sesión**: terminé adoptando el flip 3D como versión
final (antes lo había descartado por el punto anterior). Resolví el costo del
alto fijo midiendo el contenido más largo de las 8 tarjetas y dejando margen
de sobra en `.food-card` (400px desktop / 370px tablet / 420px mobile) — con
eso ninguna descripción se recorta. El costo de "esconder el nombre al
voltear" lo acepté: para este catálogo priman los datos de exploración
(tiempo, sabores, región) por sobre tener el nombre visible todo el tiempo.
