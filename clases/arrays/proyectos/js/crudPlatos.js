/* crudPlatos.js — guía semana 11, sección 5: las 4 funciones CRUD sobre la
   tabla "platos" de Supabase. Requiere supabaseClient.js cargado antes. */

const TABLA = 'platos';

// READ de todos — order('id') mantiene siempre el mismo orden en pantalla
async function listarPlatos() {
  const { data, error } = await db.from(TABLA).select('*').order('id');
  if (error) {
    console.log("Error al listar:", error);
    return null;
  }
  return data;
}

// CREATE — insert() recibe un ARRAY; .select() devuelve la fila creada (con su id).
// El id lo genera Postgres, por eso "datos" no lo trae.
async function agregarPlato(datos) {
  const { data, error } = await db.from(TABLA).insert([datos]).select();
  if (error) {
    console.log("Error al agregar:", error);
    return null;
  }
  return data[0];
}

// READ por id — single() = una sola fila, como objeto
async function buscarPlatoPorId(id) {
  const { data, error } = await db.from(TABLA).select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

// READ por nombre — ilike = like sin distinguir mayúsculas; % = cualquier texto
async function buscarPlatosPorNombre(texto) {
  const { data, error } = await db.from(TABLA).select('*').ilike('nombre', `%${texto}%`);
  if (error) return [];
  return data;
}

// UPDATE — solo cambia las propiedades que vengan en "cambios"
async function modificarPlato(id, cambios) {
  const { data, error } = await db.from(TABLA).update(cambios).eq('id', id).select();
  if (error) return null;
  return data[0];
}

// DELETE — true si NO hubo error
async function eliminarPlato(id) {
  const { error } = await db.from(TABLA).delete().eq('id', id);
  return !error;
}
