# Producciones audiovisuales — versiones de prompt

Una fila por versión renderizada. La columna `cambio` registra **una sola variable**
por versión: si cambian dos cosas a la vez, no se puede saber cuál causó el resultado.

| Pieza | Escena | Versión | Cambio respecto de la anterior | Estado |
|---|---|---|---|---|
| _(ejemplo)_ Spot 30s | A — entrada del personaje | v1 | Versión base | Aprobado |
| _(ejemplo)_ Spot 30s | A — entrada del personaje | v2 | Vestuario: camiseta → buzo | Aprobado |
| _(ejemplo)_ Spot 30s | B — plano del carrito | v1 | Versión base | Descartado |

## Continuidad a sostener entre tomas
- Personaje: mismo vestuario y mismo peinado en todas las escenas de una pieza.
- Paleta: la definida en `referencias_proyecto.md`.
- Encuadre: si una escena cambia de lente o distancia, anotarlo acá, no solo en el prompt.

## Renders fallidos
Cuando un render sale distinto a lo pedido, anotar qué parte del prompt lo provocó.
Sirve igual que `WORK-MEMORY/registro_errores.csv`: el patrón repetido es la señal útil.

| Fecha | Pieza | Qué salió mal | Qué parte del prompt lo causó |
|---|---|---|---|
