/* prueba.js — guía semana 11, 4.4, sobre la tabla real "platos" */
document.getElementById('btn-traer').addEventListener('click', async () => {
  // async/await: la consulta viaja por internet, hay que esperar la respuesta
  const { data, error } = await db.from('platos').select('*');

  // Se revisa "error" ANTES de usar "data": si falla, data llega como null
  if (error) {
    document.getElementById('resultado').textContent = 'Error: ' + error.message;
    return;
  }

  // map() es sincrónico: ya tenemos los datos en memoria, no lleva await
  const nombres = data.map(plato => plato.nombre);
  document.getElementById('resultado').innerHTML =
    '<ul>' + nombres.map(n => `<li>${n}</li>`).join('') + '</ul>';
});
