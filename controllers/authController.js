const authService = require("../services/authService")

module.exports = {
    async login(req, res) {
        const {email, password} = req.body; 

        if (!email || !password) {
            return res.status(400).json({message: "Email e senha são obrigatórios "})
        }

        try {
            const token = await authService.login(email, password)
            return res.status(200).json({token})
        } catch (err) {
            return res.status(err.code || 500).json( { message: err.message})
        }
    },

    async register(req, res) {
        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json({message: "Email e senha são obrigatórios"})
        }

        try {
            const result = await authService.register(email, password)
            return res.status(201).json(result)
        } catch (err) {
            return res.status(err.code || 500).json({message: err.message})
        } 
    }
}