// =============================================
// datos.js
// Capa de acceso a datos (CRUD) con Supabase.
// Es lo único que habla con la base de datos: script.js (vitrina) y
// gestion.js (panel) llaman a estas funciones y no saben nada de Supabase.
// Requiere supabaseClient.js cargado antes (de ahí sale "db").
// =============================================

const TABLA = "platos";

const Datos = {
  // READ de todos. order("id") mantiene siempre el mismo orden en pantalla.
  async listar() {
    const { data, error } = await db
      .from(TABLA)
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return data;
  },

  // READ de uno por id. single() = una sola fila, como objeto (no array).
  async obtener(id) {
    const { data, error } = await db
      .from(TABLA)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  // CREATE. insert() recibe un ARRAY aunque sea un solo registro; .select()
  // devuelve la fila ya creada (con el id que genera Postgres).
  async crear(registro) {
    const { data, error } = await db
      .from(TABLA)
      .insert([registro])
      .select();
    if (error) throw error;
    return data[0];
  },

  // UPDATE. Solo cambia las propiedades que vengan en "cambios".
  async actualizar(id, cambios) {
    const { data, error } = await db
      .from(TABLA)
      .update(cambios)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // DELETE.
  async eliminar(id) {
    const { error } = await db
      .from(TABLA)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
};

// Diferencia con crudPlatos.js (versión anterior): estas funciones LANZAN el
// error (throw) en vez de devolver null/false. Así quien las llama decide qué
// mostrar con try/catch (mensaje en pantalla, estado "Sin conexión", etc.).
