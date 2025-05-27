import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://base_prueba:usuario12@cluster0.yq4bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  try {
    await client.connect();
    const db = client.db('tu-db');
    const collection = db.collection('registros');

    if (req.method === 'POST') {
      // Guardar registro
      const nuevoRegistro = {
        id: Date.now(),
        fecha: new Date().toLocaleString(),
        tecla: req.body.tecla
      };
      await collection.insertOne(nuevoRegistro);
      return res.status(200).json({ success: true });

    } else if (req.method === 'GET') {
      // Obtener últimos 20 registros
      const registros = await collection
        .find()
        .sort({ _id: -1 })
        .limit(20)
        .toArray();
      return res.status(200).json(registros);
    }

  } catch (error) {
    console.error("Error con MongoDB:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  } finally {
    await client.close();
  }
}