// Array en memoria (se reinicia al redeploy)
let registros = [];

export default function handler(req, res) {
  // Configura CORS para permitir acceso desde tu dominio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === 'POST') {
    try {
      const nuevoRegistro = {
        id: Date.now(),
        fecha: new Date().toLocaleString(),
        tecla: req.body.tecla
      };

      registros.unshift(nuevoRegistro); // Agrega al inicio
      if (registros.length > 20) registros.pop(); // Limita a 20

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Error al guardar" });
    }
  } 
  else { // GET
    return res.status(200).json(registros);
  }
}