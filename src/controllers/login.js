const knexConfig = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { username, senha } = req.body;

    if (!username || !senha) {
        console.log(username, senha)
        return res.status(400).json('Username ou senha inválido.');
    }

    try {
        const user = await knexConfig('usuarios').where({ username }).first();

        if (!user) {
            return res.status(404).json('Usuário não encontrado.');
        }

        const correctPass = await bcrypt.compare(senha, user.senha);

        if (!correctPass) {
            return res.status(400).json('Email e senha não confere.');
        }

        const infosToken = {
            id: user.id,
            username: user.username
        }

        const token = jwt.sign(infosToken, process.env.HASH_PASS, { expiresIn: '8h' });

        const { senha: _, ...userInfos } = user;

        return res.status(200).json({
            usuario: userInfos,
            token
        });

    } catch (error) {
        console.log(error.message)
        return res.status(400).json(`Erro interno do servidor: /n${error.message}`);
    }
}

module.exports = login;