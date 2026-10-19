# Bitácora de reflexiones

Una entrada breve por sesión: qué aprendí o qué me costó más, escrita al cierre.
La agrega el agente cuando pregunta al final de cada sesión, con encabezado de fecha
(`## AAAA-MM-DD`), la más reciente arriba.

## 2026-09-25

Lo que más costó hoy: el login y el uso de `localStorage`. La parte conceptual
clave fue entender que cada página HTML (`index.html`, `gestion.html`) corre
con su propia memoria — las variables de JavaScript no se comparten entre
pestañas ni sobreviven a un refresh por sí solas. `localStorage` resuelve eso
porque vive por *origen* (mismo protocolo + dominio + puerto), no por página,
así que sirve como punto compartido entre archivos distintos. También quedó
claro que el login con credenciales en un archivo JS del lado del cliente
(`CREDENCIALES.JS`) no es seguridad real — cualquiera puede leerlas desde las
DevTools — sino un ejercicio de mostrar/ocultar UI según un estado.

Construido hoy: separación de `data.js`/`script.js` en el proyecto de
`proyectos/`, CRUD completo (Create/Read/Update/Delete) sobre el array de
platos en `gestion.html`, persistencia con `localStorage`, modal de detalle
en `index.html` al hacer clic en una tarjeta, y panel de login que oculta el
CRUD hasta autenticarse.

## 2026-09-19 — Catálogo "Sabores de Colombia"

**Exploración de estilo.** Probé primero un overlay de hover (`opacity`) y
luego, para explorar transforms distintos al `translateY` que ya usaba, le
pedí a la IA una tarjeta con giro 3D (`rotateY(180deg)` sobre `.food-flipper`,
con `perspective` en el padre y `backface-visibility: hidden` en cada cara).
Resultado: el giro se ve mejor, pero cuesta una altura fija en `.food-card`
(con descripciones largas se arriesga a recortar texto) y esconde el nombre
del plato al voltear. Lo resolví midiendo la descripción más larga (400 / 370
/ 390px según el breakpoint) y acepté lo del nombre porque en este catálogo
pesan más los datos de detalle. Terminé quedándome con el giro 3D.

**Cómo fui mejorando la página y por qué** (una cosa a la vez, para comparar):

1. *Base funcional:* array de 8 objetos con texto, número, booleano y array;
   tarjetas generadas desde el JS clonando un `<template>` y 3 breakpoints.
   Sin esto no había nada que embellecer.
2. *Interacción:* comparé overlay y giro 3D y elegí el giro, porque el detalle
   del plato gana con una "segunda cara".
3. *Identidad visual:* le pedí a la IA un diseño más bonito y alusivo al tema:
   franja tricolor arriba (`linear-gradient` con las proporciones de la
   bandera) y cenefa de rombos wayuu abajo (SVG repetido), ambas en
   `::before` / `::after` para no llenar el HTML de adornos. Los pasteles
   puros casi no se veían en franjas delgadas, así que agregué variantes más
   intensas solo para la decoración.
4. *Jerarquía:* el frente quedó con foto, nombre y descripción; región, tipo
   de plato (según el booleano `esVegetariano`, cambia texto, ícono y color),
   tiempo y sabores pasaron al reverso. Cambié los emojis por SVG de línea; el
   costo fue dibujar a mano la cuchara y la presa de carne a 20px.
5. *Contenido y pulido:* investigué los matices de sabor (guascas, cilantro
   cimarrón, queso costeño) y pasé a 3 sabores por plato; usé una foto más
   elegante del arequipe desde un URL público, porque un archivo local no se
   vería en CodePen; y quité lo que no aportaba (pie de página, número de
   catálogo, función de imagen de reemplazo).

**Errores y aprendizajes.**

- Ocultar el ícono con `elemento.hidden = ...` no funcionó: los `<svg>` no
  tienen esa propiedad. Lo resolví con `toggleAttribute("hidden", ...)`, y al
  borrar la regla CSS `svg[hidden]` por creerla redundante se veían los dos
  íconos a la vez. Lección: comprobar en pantalla antes de dar una limpieza
  por buena.
- Centrar el texto del frente en vertical dejaba los títulos a alturas
  distintas según el largo de la descripción; lo cambié por un inicio fijo,
  un poco más abajo, y así se alinean.
- En móvil sobraban unos 85px de espacio vacío en cada tarjeta; bajé el alto
  de 420px a 390px y comprobé que ningún texto se cortara.
- A 20px la cuchara del ícono de sabores se parece a una paleta: es un
  detalle que quedó por pulir.
- En CodePen (editor nuevo) la página salía sin estilos ni tarjetas: había
  que enlazar `style.css` y `script.js` desde el HTML.
- Cada cambio lo probé antes en el navegador con un servidor local, y solo
  después lo pasé a CodePen.

**Resultado final.** Un catálogo de 8 platos con tarjetas que giran en 3D,
decoración inspirada en la bandera y en las mochilas wayuu, íconos SVG,
información repartida entre frente y reverso, y código comentado por bloque.
Lo revisé en escritorio, tablet y móvil, y en el CodePen publicado.
