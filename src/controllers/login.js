const database = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await database('usuarios').where({ email }).first();

    if (!user) {
      return res.status(404).json('Usuário não encontrado.');
    }

    const correctPass = await bcrypt.compare(senha, user.senha);

    if (!correctPass) {
      return res.status(400).json('Email ou senha inválido.');
    }

    const token = jwt.sign({ id: user.id }, process.env.HASH_PASS, {
      expiresIn: '8h',
    });

    const { senha: _, ...userInfos } = user;

    return res.status(200).json({
      usuario: userInfos,
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json('Erro interno do servidor');
  }
};

module.exports = login;
