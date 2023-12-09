# Projeto mini rede social

## O que o usuário pode fazer:

- Login
- Cadastro
- Ver dados do seu perfil
- Editar dados do seu perfil
- Ver postagens de outras pessoas
    - Ver quantidade de curtidas de uma postagem
    - Ver comentários de uma postagem
- Curtir as postagens de outras pessoas

- Comentar nas postagens

## O que não poderá fazer:

- Ver a localização de uma postagem
- Ver pessoas que curtiram uma postagem
- Curtir um comentário
- Comentar em outros comentários

## Endpoints:

### POST - login

#### Dados enviados
- username
- senha
 
#### Dados retornados
- sucesso (token) / erro

#### Objetivos gerais:
- validar username e senha
- buscar o usuário no banco de dados
- verificar se a senha informada está correta
- gerar o token de autenticação
- retornar os dados do usuário e o token gerado


---
### POST - cadastro

#### Dados enviados
- username
- senha

#### Dados retornados
- sucesso / erro

#### Objetivos gerais:
- validar username e senha
- verificar se o username já existe no banco de dados 
- criptografar a senha
- cadastrar o usuário no banco de dados
- retornar sucesso ou erro


---
### GET - perfil

#### Dados enviados
- token (id, userName...)

#### Dados retornados
- URL da foto
- nome
- userName
- site
- bio
- email
- telefone
- genero

#### Objetivos gerais:
- validar token do usuário
- buscar o cadastro do usuário com a informação que vem do token
- retornar os dados do usuário


---
### PUT - perfil

#### Dados enviados
- token (id, userName...)
- URL da foto
- nome
- userName
- site
- bio
- email
- telefone
- genero
- senha

#### Dados retornados
- sucesso / erro

#### Objetivos gerais:
- validar token do usuário
- buscar o cadastro do usuário com a informação que vem do token
- exigir ao menos um campo para atualizar
- criptografar a senha, se for informada
- verificar se email e username já existe no banco de dados, se for informado
- atualizar o registro do usuário no banco de dados
- retornar sucesso ou erro


---
### GET - postagens

#### Dados enviados
- token
- offset

#### Dados retornados
- postagens []
    - id postagem
    - texto
    - já foi curtido por mim?
    - usuário
        - URL foto
        - userName
        - é perfil oficial?
    - fotos []
    - quantidade de curtidas
    - comentários []
        - userName
        - texto
    - data

#### Objetivos gerais:
- validar token do usuário
- buscar o cadastro do usuário com a informação que vem do token
- retornar postagens de outras pessoas


---
### POST - postagens

#### Dados enviados
- token
- texto
- fotos []

#### Dados retornados
- sucesso ou erro

#### Objetivos gerais:
- validar token do usuário
- buscar o cadastro do usuário com a informação que vem do token
- exigir que seja informado ao menos uma foto no array
- cadastrar postagem para o usuário logado
- cadastro das fotos da postagem
- retornar sucesso ou erro


---
### POST - curtir

#### Dados enviados
- token
- id postagem

#### Dados retornados
- sucesso / erro

#### Objetivos gerais:
- validar token do usuário
- buscar o cadastro do usuário com a informação que vem do token
- buscar o cadastro da postagem com o id informado
- verificar se o usuário já curtiu a postagem
- cadastrar curtida da postagem no banco de dados
- retornar sucesso ou erro


---
### POST - comentar

#### Dados enviados
- token
- id postagem
- texto do comentário

#### Dados retornados
- sucesso / erro

#### Objetivos gerais:
- validar token do usuário
- buscar o cadastro do usuário com a informação que vem do token
- validar o texto
- buscar a postagem pelo id informado
- cadastrar comentário da postagem
- retonar sucesso ou erro