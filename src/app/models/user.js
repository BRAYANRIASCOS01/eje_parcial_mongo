// models/User.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'], // Hace que el nombre sea requerido
    trim: true, // Elimina espacios en blanco al inicio y final
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres.']
  },
  lastname: {
    type: String,
    required: [true, 'El apellido es obligatorio.'],
    trim: true,
    maxlength: [50, 'El apellido no puede tener más de 50 caracteres.']
  },
  age: {
    type: Number,
    min: [0, 'La edad no puede ser negativa.'], // Edad mínima
    max: [120, 'La edad no puede ser mayor a 120.'], // Edad máxima
    required: false // Opcional, si la edad no siempre es necesaria
  },
  email: { // **¡Muy recomendado añadir un campo de email!**
    type: String,
    required: [true, 'El correo electrónico es obligatorio.'],
    unique: true, // Asegura que no haya dos usuarios con el mismo email
    trim: true,
    lowercase: true, // Convierte el email a minúsculas antes de guardar
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, introduce un correo electrónico válido.']
  },
  createdAt: { // Fecha de creación
    type: Date,
    default: Date.now // Establece la fecha actual por defecto
  },
  updatedAt: { // Fecha de última actualización
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar la fecha de 'updatedAt' en cada guardado
schema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('User', schema);