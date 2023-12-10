const database = require('../connection');
const bcrypt = require('bcrypt');
const { nameFormatter } = require('../utils/dataFormatter');

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const cryptPass = await bcrypt.hash(senha, 10);

    const user = await database('usuarios').insert({
      nome: nameFormatter(nome),
      email,
      senha: cryptPass,
    });

    if (!user) {
      return res.status(400).json('O usuário não foi cadastrado.');
    }

    return res.status(201).json('Usuário cadastrado com sucesso.');
  } catch (error) {
    return res.status(400).json('Erro interno do servidor');
  }
};

const profileInfos = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateProfile = async (req, res) => {
  let { nome, email, senha, site, bio, telefone, genero, imagem } = req.body;
  const { id } = req.user;

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json('É obrigatório informar ao menos um campo para atualização.');
  }

  try {
    if (nome) {
      await database('usuarios')
        .where({ id })
        .update({ nome: nameFormatter(nome) });
    }

    if (email) {
      const userEmailExists = await database('usuarios')
        .where({ email })
        .first();
      if (userEmailExists && userEmailExists.id != id) {
        return res.status(400).json('Email inválido.');
      }
      await database('usuarios').where({ id }).update({ email });
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10);
      await database('usuarios').where({ id }).update({ senha });
    }

    if (site) {
      await database('usuarios').where({ id }).update({ site });
    }

    if (bio) {
      await database('usuarios').where({ id }).update({ bio });
    }

    if (telefone) {
      await database('usuarios').where({ id }).update({ telefone });
    }

    if (genero) {
      await database('usuarios').where({ id }).update({ genero });
    }

    if (imagem) {
      await database('usuarios').where({ id }).update({ imagem });
    }

    return res.status(200).json('Usuário atualizado com sucesso.');
  } catch (error) {
    return res.status(400).json('Erro interno do servidor');
  }
};

module.exports = {
  registerUser,
  profileInfos,
  updateProfile,
};
