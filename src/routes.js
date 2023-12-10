const { Router } = require('express');
const validateUser = require('./middlewares/validateUser');
const validateBodyRequisition = require('./middlewares/validateBodyRequisition');
const users = require('./controllers/users');
const posts = require('./controllers/posts');
const login = require('./controllers/login');
const userSchema = require('./schemas/registerUsers');
const loginSchema = require('./schemas/login');
const UpdateUserSchema = require('./schemas/updateUser');

const route = Router();

route.post(
  '/cadastro',
  validateBodyRequisition(userSchema),
  users.registerUser
);

route.post('/login', validateBodyRequisition(loginSchema), login);

route.use(validateUser);

route.get('/perfil', users.profileInfos);
route.put(
  '/perfil',
  validateBodyRequisition(UpdateUserSchema),
  users.updateProfile
);

route.post('/postagens', posts.newPost);
route.get('/postagens', posts.feed);
route.post('/postagens/:postagemId/curtir', posts.like);
route.post('/postagens/:postagemId/comentar', posts.comment);

module.exports = route;
