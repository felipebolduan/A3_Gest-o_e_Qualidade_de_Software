const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Configuração do ambiente
dotenv.config();

// Inicialize o Firebase
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json')),
});

const app = express();
app.use(bodyParser.json());

// Rotas principais
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
