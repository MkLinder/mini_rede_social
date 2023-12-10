const joiValidations = require('joi');

const UpdateUserSchema = joiValidations.object({
  nome: joiValidations.string(),
  imagem: joiValidations.string(),
  site: joiValidations.string(),
  bio: joiValidations.string(),
  telefone: joiValidations.string(),
  genero: joiValidations.string(),
  email: joiValidations.string().email().messages({
    'string.email': 'O campo email precisa ter um formato válido.',
  }),

  senha: joiValidations.string().min(6).messages({
    'string.min': 'A senha deve ter no mínimo 6 caracteres.',
  }),
});

module.exports = UpdateUserSchema;
