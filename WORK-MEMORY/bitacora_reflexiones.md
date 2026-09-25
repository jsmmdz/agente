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
