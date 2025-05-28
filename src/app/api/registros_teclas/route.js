
import { NextResponse } from "next/server";
import { conectDB } from "../../libs/db"; // Asegúrate de que la ruta sea correcta
import RegistroTeclas from "../../models/registroteclas"; // ¡Importa tu nuevo modelo!

/**
 * Maneja las solicitudes GET para obtener todos los registros de teclas.
 * Puedes añadir lógica de filtrado o paginación si es necesario en el futuro.
 */
export async function GET() {
  try {
    await conectDB();
    const registros = await RegistroTeclas.find({}).sort({ fecha_hora: -1 }); // Ordenar por fecha_hora descendente
    return NextResponse.json(registros, { status: 200 });
  } catch (error) {
    console.error("Error al obtener registros de teclas:", error);
    return NextResponse.json(
      { message: "Error al obtener registros de teclas", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Maneja las solicitudes POST para crear un nuevo registro de tecla.
 * Espera un objeto JSON con la propiedad 'tecla'. 'fecha_hora' se generará automáticamente.
 */
export async function POST(request) {
  try {
    await conectDB();
    const body = await request.json(); // Espera { "tecla": "a" }

    // Puedes validar que 'tecla' esté presente en el body si quieres una validación temprana
    if (!body.tecla) {
        return NextResponse.json(
            { message: "El campo 'tecla' es obligatorio." },
            { status: 400 }
        );
    }

    const nuevoRegistro = await RegistroTeclas.create(body); // Crea el nuevo registro

    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error) {
    console.error("Error al crear registro de tecla:", error);
    if (error.name === 'ValidationError') {
        return NextResponse.json(
            { message: "Error de validación al crear registro", error: error.message },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: "Error al crear registro de tecla", error: error.message },
      { status: 500 }
    );
  }
}
