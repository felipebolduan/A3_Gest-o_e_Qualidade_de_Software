const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const router = express.Router();
const JWT_SECRET = 'key_projeto_a3_jean'; 

// Inicializa Firebase
//initializeApp();
const db = getFirestore();

// Endpoint de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação básica
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Verifica se o usuário existe
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Compara a senha fornecida com a senha criptografada
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gera o token JWT
        const token = jwt.sign({ uid: userDoc.id }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação básica
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Verifica se o usuário já existe
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (!snapshot.empty) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salva o usuário no Firestore
        const newUser = {
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        const result = await usersRef.add(newUser);

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            userId: result.id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

module.exports = router;
