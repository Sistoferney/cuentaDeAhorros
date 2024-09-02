const Celda = require('../models/cuenta');
const encryptPin = require('../utils/encryptPin');


// Crear una nueva cuenta
exports.crearCuenta = async (req, res) => {
  try {
    const count = await Cuenta.countDocuments();
    if (count >= 10) {
      return res.status(400).json({ message: 'No se pueden crear más de 10 celdas' });
    }

    const nuevaCelda = new Celda({
      numeroCelda: count + 1,
      estado: 'disponible'
    });

    await nuevaCelda.save();
    res.status(201).json(nuevaCelda);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener una celda específica
exports.obtenerCelda = async (req, res) => {
  try {
    const celda = await Celda.findById(req.params.id);
    if (!celda) {
      return res.status(404).json({ message: 'Celda no encontrada' });
    }
    res.json(celda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las celdas
exports.obtenerTodasCeldas = async (req, res) => {
  try {
    const celdas = await Celda.find();
    res.json(celdas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener celdas por estado
exports.obtenerCeldasPorEstado = async (req, res) => {
  try {
    const celdas = await Celda.find({ estado: req.params.estado });
    res.json(celdas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una celda
exports.actualizarCelda = async (req, res) => {
  try {
    const celda = await Celda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!celda) {
      return res.status(404).json({ message: 'Celda no encontrada' });
    }
    res.json(celda);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una celda
exports.eliminarCelda = async (req, res) => {
  try {
    const celda = await Celda.findByIdAndDelete(req.params.id);
    if (!celda) {
      return res.status(404).json({ message: 'Celda no encontrada' });
    }
    res.json({ message: 'Celda eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Parquear un vehículo
exports.parquearVehiculo = async (req, res) => {
  try {
    const { placaVehiculo } = req.body;
    const celda = await Celda.findOne({ estado: 'disponible' });
    if (!celda) {
      return res.status(400).json({ message: 'No hay celdas disponibles' });
    }

    celda.placaVehiculo = placaVehiculo;
    celda.estado = 'no disponible';
    celda.fechaIngreso = new Date();
    celda.pin = encryptPin(celda.numeroCelda.toString() + placaVehiculo);

    await celda.save();
    res.json(celda);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Calcular valor a pagar
exports.calcularValor = async (req, res) => {
  try {
    const celda = await Celda.findById(req.params.id);
    if (!celda || celda.estado === 'disponible') {
      return res.status(400).json({ message: 'Celda no ocupada' });
    }

    const horasEstacionado = Math.max(1, Math.floor((new Date() - celda.fechaIngreso) / (1000 * 60 * 60)));
    const valorAPagar = horasEstacionado * 5000;

    res.json({ horasEstacionado, valorAPagar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Salida de vehículo
exports.salidaVehiculo = async (req, res) => {
  try {
    const celda = await Celda.findById(req.params.id);
    if (!celda || celda.estado === 'disponible') {
      return res.status(400).json({ message: 'Celda no ocupada' });
    }

    celda.estado = 'disponible';
    celda.placaVehiculo = null;
    celda.fechaSalida = new Date();
    celda.pin = null;

    await celda.save();
    res.json(celda);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};