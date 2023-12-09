const knexConfig = require('../connection');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  // if (!username || !senha) {
  //     return res.status(400).json('Todos os campos são obrigatórios.');
  // }

  // if (senha.length < 6) {
  //     return res.status(400).json('A senha deve conter no mínimo 6 caracteres.');
  // }

  try {
    const cryptPass = await bcrypt.hash(senha, 10);

    const user = await knexConfig('usuarios').insert({
      nome,
      email,
      senha: cryptPass,
    });

    if (!user) {
      return res.status(400).json('O usuário não foi cadastrado.');
    }

    return res.status(200).json('Usuário cadastrado com sucesso.');
  } catch (error) {
    return res.status(400).json(`Erro interno do servidor: ${error.message}`);
  }
};

const profileInfos = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateProfile = async (req, res) => {
  let { nome, email, senha, imagem, username, site, bio, telefone, genero } =
    req.body;

  const { id } = req.user;

  if (
    !nome &&
    !email &&
    !senha &&
    !imagem &&
    !username &&
    !site &&
    !bio &&
    !telefone &&
    !genero
  ) {
    return res
      .status(400)
      .json('É obrigatório informar ao menos um campo para atualização.');
  }

  try {
    if (senha) {
      if (senha.length < 6) {
        return res
          .status(400)
          .json('A senha deve conter no mínimo 6 caracteres.');
      }

      senha = await bcrypt.hash(senha, 10);
    }

    if (email) {
      if (email != req.user.email) {
        const userEmailExists = await knexConfig('usuarios')
          .where({ email })
          .first();

        if (userEmailExists) {
          return res.status(400).json('O email já existe.');
        }
      }
    }

    if (username) {
      if (username != req.user.username) {
        const userUsernameExists = await knexConfig('usuarios')
          .where({ username })
          .first();

        if (userUsernameExists) {
          return res.status(400).json('O username já existe.');
        }
      }
    }

    const updatedProfile = await knexConfig('usuarios').where({ id }).update({
      nome,
      email,
      senha,
      imagem,
      username,
      site,
      bio,
      telefone,
      genero,
    });

    if (!updatedProfile) {
      return res.status(400).json('O usuário não foi atualizado.');
    }

    return res.status(200).json('Usuário atualizado com sucesso.');
  } catch (error) {
    return res.status(400).json(`Erro interno do servidor: /n${error.message}`);
  }
};

module.exports = {
  registerUser,
  profileInfos,
  updateProfile,
};
