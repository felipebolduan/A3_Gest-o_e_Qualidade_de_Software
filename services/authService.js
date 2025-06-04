const { getFirestore } = require("firebase-admin/firestore")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "key_projeto_a3_poyatos"

function getDb() {
  return getFirestore();
}

async function findUserByEmail(email) {
    const db = getDb()
    const snapshot = await db.collection("users").where("email", "==", email).get()
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
}

module.exports = {
  async login(email, password) {
    const user = await findUserByEmail(email);

    if (!user) {
      const err = new Error('Usuário não encontrado');
      err.code = 404;
      throw err;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const err = new Error('Senha incorreta');
      err.code = 401;
      throw err;
    }

    const token = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  },

  async createUser(email, password) {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      const err = new Error('Usuário já existe');
      err.code = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    
    const db = getDb()
    const result = await db.collection('users').add(newUser);
    return {
      message: 'Usuário criado com sucesso',
      userId: result.id,
    };
  }
};



