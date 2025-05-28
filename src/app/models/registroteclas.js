// models/RegistroTeclas.js
import mongoose from 'mongoose';

const RegistroTeclasSchema = new mongoose.Schema({
  tecla: {
    type: String,
    required: [true, 'La tecla es obligatoria.'],
    trim: true,
    maxlength: [20, 'La tecla no puede tener más de 20 caracteres.'] // Para teclas como 'Space', 'Shift', 'a', 'b', etc.
  },
  fecha_hora: {
    type: Date,
    default: Date.now, // Establece la fecha y hora actual por defecto al crear el registro
   
  }
});

// Exporta el modelo. Esto es importante para que Next.js no recompile el modelo en desarrollo.
export default mongoose.models.RegistroTeclas || mongoose.model('RegistroTeclas', RegistroTeclasSchema);
