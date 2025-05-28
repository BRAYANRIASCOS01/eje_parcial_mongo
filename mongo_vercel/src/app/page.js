"use client"; // Indica que este es un Client Component

import { useEffect, useState, useCallback } from "react";

function HomePage() {
  // Estado para almacenar la lista de registros de teclas
  const [keyLogs, setKeyLogs] = useState([]);
  // Estado para manejar el estado de carga de los datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar cualquier error durante la carga o envío
  const [error, setError] = useState(null);
  // Estado para mostrar un mensaje cuando una tecla se está guardando
  const [savingKey, setSavingKey] = useState(false);

  // Función para obtener los registros de teclas de la API
  const fetchKeyLogs = useCallback(async () => {
    try {
      setLoading(true); // Establece el estado de carga a true
      const res = await fetch("/api/registros_teclas"); // Llama a tu API para obtener registros de teclas

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Parsea la respuesta JSON
      setKeyLogs(data); // Actualiza el estado de registros de teclas con los datos obtenidos
    } catch (err) {
      console.error("Error fetching key logs:", err);
      setError("Error al cargar los registros de teclas. Por favor, inténtalo de nuevo."); // Establece el mensaje de error
    } finally {
      setLoading(false); // Siempre establece el estado de carga a false al finalizar
    }
  }, []); // El array vacío asegura que esta función se cree una sola vez

  // Función para manejar los eventos de pulsación de tecla (keydown) y enviar datos a la API
  const handleKeyDown = useCallback(async (event) => {
    // Define las teclas de flecha que queremos registrar
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    // Solo guarda si la tecla pulsada es una de las teclas de flecha
    if (!arrowKeys.includes(event.key)) {
      return; // Si no es una tecla de flecha, no hace nada
    }

    const key = event.key; // Obtiene la tecla pulsada
    const fecha_hora = new Date(); // Obtiene la fecha y hora actual

    try {
      setSavingKey(true); // Indica que una tecla se está guardando
      setError(null); // Limpia cualquier error previo

      const res = await fetch("/api/registros_teclas", {
        method: "POST", // Especifica el método POST
        headers: {
          "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es JSON
        },
        body: JSON.stringify({ tecla: key, fecha_hora: fecha_hora }), // Envía la tecla y la marca de tiempo
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      // Después de guardar, actualiza la lista de registros de teclas
      fetchKeyLogs();
    } catch (err) {
      console.error("Error saving key log:", err);
      setError(`Error al guardar la tecla: ${err.message}.`); // Muestra el error específico
    } finally {
      setSavingKey(false); // Reinicia el estado de guardado
    }
  }, [fetchKeyLogs]); // Dependencia de fetchKeyLogs para asegurar que esté actualizada

  // useEffect para añadir y eliminar el listener de eventos de teclado
  useEffect(() => {
    fetchKeyLogs(); // Obtiene los registros de teclas iniciales cuando el componente se monta

    window.addEventListener("keydown", handleKeyDown); // Añade el listener de eventos

    // Función de limpieza: elimina el listener de eventos cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fetchKeyLogs, handleKeyDown]); // Dependencias para useEffect

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-8 drop-shadow-lg text-center">
        Registro de Pulsaciones de Teclas
      </h1>

      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        ¡Solo se registrarán las teclas de **flecha**! Pulsa cualquier flecha para ver el registro.
      </p>

      {/* Mensajes de carga y error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6 shadow-md" role="alert">
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {savingKey && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg relative mb-6 shadow-md">
          <span className="block sm:inline">Guardando tecla...</span>
        </div>
      )}

      {/* Sección para mostrar los registros de teclas en una tabla */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 pb-3">
          Historial de Teclas Registradas
        </h2>
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Cargando registros...</p>
        ) : keyLogs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No hay registros de teclas. ¡Empieza a escribir para verlos aquí!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tecla
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keyLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.tecla === 'ArrowUp' ? 'Flecha Arriba' :
                         log.tecla === 'ArrowDown' ? 'Flecha Abajo' :
                         log.tecla === 'ArrowLeft' ? 'Flecha Izquierda' :
                         log.tecla === 'ArrowRight' ? 'Flecha Derecha' :
                         log.tecla}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(log.fecha_hora).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
