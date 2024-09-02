const mongoose = require('mongoose');

const cuentaSchema = new mongoose.Schema({
    numeroCuenta: {
        type: Number,
        unique: true,
        required: true
    },
    documentoCliente: {
        type: String,
        required: true
    },
    fechaApertura: {
        type: Date,
        default: Date.now
    },
    saldo: {
        type: Number,
        default: 0
    },
    claveAcceso: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Cuenta', cuentaSchema);
