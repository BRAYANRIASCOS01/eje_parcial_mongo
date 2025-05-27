

const API_URL = '/api/db';

// Guardar registro
async function guardarRegistro(tecla) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tecla })
    });
    await cargarRegistros(); // Actualizar tabla
  } catch (error) {
    console.error("Error al guardar:", error);
  }
}

// Cargar registros
async function cargarRegistros() {
  try {
    const response = await fetch(API_URL);
    const registros = await response.json();
    actualizarTabla(registros);
  } catch (error) {
    console.error("Error al cargar:", error);
  }
}

// Detectar teclas (igual que antes)
document.addEventListener('keydown', (e) => {
  const flechas = {
    'ArrowUp': '↑ Arriba',
    'ArrowDown': '↓ Abajo',
    'ArrowLeft': '← Izquierda',
    'ArrowRight': '→ Derecha'
  };
  if (flechas[e.key]) guardarRegistro(flechas[e.key]);
});