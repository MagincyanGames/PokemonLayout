const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// 1. Las llamadas al Socket las mandamos al Backend (Puerto 3000)
app.use('/socket.io', createProxyMiddleware({
    target: 'http://localhost:3000',
    ws: true, // ¡Importante para WebSockets!
    changeOrigin: true
}));

// 2. Servimos el Frontend buildeado para todo lo demás
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// 3. Soporte para rutas de React (como /dev)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(8080, '0.0.0.0', () => {
    console.log('🚀 Proxy de Producción en :D');
});