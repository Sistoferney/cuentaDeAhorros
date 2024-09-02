const express = require('express');
const bcrypt = require('bcryptjs');
const Cuenta = require('../models/cuenta');
const router = express.Router();

// Crear Cuenta
router.post('/', async (req, res) => {
    try {
        const { documentoCliente, claveAcceso } = req.body;

        // Encriptar la clave de acceso
        const hashedClave = await bcrypt.hash(claveAcceso, 10);

        const lastAccount = await Cuenta.findOne().sort({ numeroCuenta: -1 });
        const numeroCuenta = lastAccount ? lastAccount.numeroCuenta + 1 : 1;

        const nuevaCuenta = new Cuenta({
            numeroCuenta,
            documentoCliente,
            claveAcceso: hashedClave
        });

        await nuevaCuenta.save();
        res.status(201).json(nuevaCuenta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Listar Cuenta
router.get('/:numeroCuenta', async (req, res) => {
    try {
        const cuenta = await Cuenta.findOne({ numeroCuenta: req.params.numeroCuenta });
        if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' });
        res.json(cuenta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Consignar Dinero
router.post('/:numeroCuenta/consignar', async (req, res) => {
    try {
        const { monto } = req.body;
        if (monto < 0) return res.status(400).json({ message: 'No se puede consignar un valor negativo.' });

        const cuenta = await Cuenta.findOne({ numeroCuenta: req.params.numeroCuenta });
        if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' });

        cuenta.saldo += monto;
        await cuenta.save();
        res.json(cuenta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Retirar Dinero
router.post('/:numeroCuenta/retiro', async (req, res) => {
    try {
        const { monto } = req.body;

        const cuenta = await Cuenta.findOne({ numeroCuenta: req.params.numeroCuenta });
        if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' });
        if (monto > cuenta.saldo) return res.status(400).json({ message: 'Saldo insuficiente para realizar el retiro.' });

        cuenta.saldo -= monto;
        await cuenta.save();
        res.json(cuenta);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar Cuenta
router.delete('/:numeroCuenta', async (req, res) => {
    try {
        const cuenta = await Cuenta.findOne({ numeroCuenta: req.params.numeroCuenta });
        if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' });
        if (cuenta.saldo !== 0) return res.status(400).json({ message: 'No se puede eliminar una cuenta con saldo diferente de cero.' });

        await cuenta.remove();
        res.json({ message: 'Cuenta eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
