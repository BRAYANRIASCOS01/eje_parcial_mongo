// src/app/api/users/route.js
import { NextResponse } from "next/server";
import { conectDB } from "../../libs/db"; // Asegúrate de que la ruta sea correcta
import User from "../../models/user"; // ¡Importa tu modelo de usuario de Mongoose!

/**
 * Maneja las solicitudes GET para obtener todos los usuarios.
 * @returns {NextResponse} Una respuesta JSON con la lista de usuarios o un mensaje de error.
 */
export async function GET() {
  try {
    // Conecta a la base de datos. La función conectDB ya maneja el caching.
    await conectDB();

    // Busca todos los documentos en la colección 'users'.
    // Si no se encuentra ninguno, devolverá un array vacío.
    const users = await User.find({});

    // Retorna los usuarios como una respuesta JSON con un estado 200 (OK).
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    // Si ocurre un error, lo registramos en la consola del servidor
    console.error("Error al obtener usuarios:", error);
    // Y devolvemos una respuesta de error al cliente con un estado 500 (Internal Server Error).
    return NextResponse.json(
      { message: "Error al obtener usuarios", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Maneja las solicitudes POST para crear un nuevo usuario.
 * @param {Request} request El objeto de la solicitud que contiene el cuerpo con los datos del usuario.
 * @returns {NextResponse} Una respuesta JSON con el usuario creado o un mensaje de error.
 */
export async function POST(request) {
  try {
    // Conecta a la base de datos.
    await conectDB();

    // Obtiene los datos del cuerpo de la solicitud en formato JSON.
    // Estos datos deben coincidir con la estructura de tu modelo User.
    const body = await request.json();

    // Crea un nuevo documento de usuario en la base de datos utilizando el modelo User.
    // Mongoose aplicará las validaciones definidas en tu esquema.
    const newUser = await User.create(body);

    // Retorna el nuevo usuario creado como una respuesta JSON con un estado 201 (Created).
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    // Si ocurre un error (ej. validación fallida, email duplicado), lo registramos.
    console.error("Error al crear usuario:", error);

    // Si el error es de validación de Mongoose, podemos devolver un 400 (Bad Request).
    if (error.name === 'ValidationError') {
        return NextResponse.json(
            { message: "Error de validación al crear usuario", error: error.message },
            { status: 400 }
        );
    }
    // Para otros errores, devolvemos un 500 (Internal Server Error).
    return NextResponse.json(
      { message: "Error al crear usuario", error: error.message },
      { status: 500 }
    );
  }
}
