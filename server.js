const express = require('express');
const path = require('path');
const app = express();

const cors = require("cors");
app.use(cors());

// Middleware para aceitar JSON
app.use(express.json());

// ✅ Rotas da API
app.use('/api/baskets', require('./routes/basketRoutes'));
app.use('/api/orders', require('./routes/orders'));

// ✅ Servir arquivos estáticos do React
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Redirecionar qualquer outra rota para o React
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
