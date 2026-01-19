const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rutas establecidas en routes/cobrador_cxc.js
const cobradorRoutes = require('./routes/cobrador_cxc');
app.use('/cobrador', cobradorRoutes);

app.get('/', (req, res) => {
    res.send('Servidor API funcionando correctamente');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});