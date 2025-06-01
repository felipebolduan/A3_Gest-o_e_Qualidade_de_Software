require('dotenv').config()
const app = require("./config/server")
require("./config/firebase")

const PORT = 3000

app.use('/auth', require('./routes/authRoutes'))
app.use('/tasks', require('./routes/tasks'))

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
