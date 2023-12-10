const validateBodyRequisition = (schema) => async (req, res, next) => {
  let body = {};

  try {
    const information = JSON.stringify(body) === '{}' ? req.body : body;

    await schema.validateAsync(information);

    next();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = validateBodyRequisition;
