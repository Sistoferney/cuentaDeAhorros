const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cuentaRoutes = require('./routes/cuenta');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/cuentaAhorros', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/api/cuentas', cuentaRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
