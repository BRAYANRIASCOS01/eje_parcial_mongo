

// libs/db.js
import mongoose from "mongoose";

// Declarar una variable global para cachear la conexión
// Esto es importante para que la conexión persista entre solicitudes
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function conectDB() {
  // Si ya tenemos una conexión cacheada, la devolvemos inmediatamente
  if (cached.conn) {
    console.log("✅ Usando conexión MongoDB cacheada.");
    return cached.conn;
  }

  // Si no hay una promesa de conexión en curso, creamos una nueva
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environmental variable inside .env.local"
      );
    }

    // Opciones para Mongoose, bufferCommands: false es común en Next.js
    const opts = {
      bufferCommands: false, // Desactiva el buffering de comandos de Mongoose
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Nueva conexión a MongoDB establecida.");
      return mongoose;
    });
  }

  // Esperamos la promesa de conexión y la guardamos en la caché
  cached.conn = await cached.promise;
  return cached.conn;
}