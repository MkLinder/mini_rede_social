const knex = require('../connection');
const jwt = require('jsonwebtoken');

const validateUser = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado.');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.HASH_PASS);

        const userExists = await knex('usuarios').where({ id }).first();

        if (!userExists) {
            return res.status(404).json('Token inválido.');
        }

        const { senha, ...user } = userExists;

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json(`Erro interno do servidor: /n${error.message}`);
    }
}

module.exports = validateUser;