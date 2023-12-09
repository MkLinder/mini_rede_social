const knexConfig = require('../connection');

const newPost = async (req, res) => {
    const { texto, fotos } = req.body;

    if (!fotos || fotos.length === 0) {
        return res.status(400).json('É preciso informar ao menos uma foto.');
    }

    try {
        const post = await knexConfig('postagens')
            .insert({ texto, usuario_id: req.user.id })
            .returning('*');

        if (!post) {
            return res.status(400).json('Não foi possível concluir a postagem.');
        }

        for (const foto of fotos) {
            foto.postagem_id = post[0].id;
        }


        const registeredPhotos = await knexConfig('postagem_fotos')
            .insert(fotos);

        if (!registeredPhotos) {
            await knexConfig('postagens')
                .where({ id: post[0].id })
                .del();

            return res.status(400).json('Não foi possível concluir a postagem.');
        }

        return res.status(201).json('Postagem realizada com sucesso.');

    } catch (error) {
        return res.status(400).json(`Erro interno do servidor: ${error.message}`);
    }
}


const like = async (req, res) => {
    const { id } = req.user;
    const { postagemId } = req.params;

    try {
        const post = await knex('postagens')
            .where({ id: postagemId })
            .first();

        if (!post) {
            return res.status(404).json('Postagem não encontrada.');
        }

        const alreadyLiked = await knex('postagem_curtidas')
            .where({ usuario_id: id, postagem_id: post.id })
            .first();

        if (alreadyLiked) {
            return res.status(400).json('O usuário já curtiu esta postagem.');
        }

        const toLike = await knex('postagem_curtidas')
            .insert({
                usuario_id: id,
                postagem_id: post.id
            });

        if (!toLike) {
            return res.status(400).json('Não foi possível essa postagem.');
        }

        return res.status(200).json('Postagem curtida!');

    } catch (error) {
        return res.status(400).json(`Erro interno do servidor: /n${error.message}`);
    }
}

const comment = async (req, res) => {
    const { id } = req.user;
    const { postagemId } = req.params;
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json('Informe o texto para comentar.');
    }

    try {
        const post = await knex('postagens')
            .where({ id: postagemId })
            .first();

        if (!post) {
            return res.status(404).json('Postagem não encontrada.');
        }

        const comment = await knex('postagem_comentarios')
            .insert({
                usuario_id: id,
                postagem_id: post.id,
                texto
            });

        if (!comment) {
            return res.status(404).json('Não foi possível inserir o comentário.');
        }

        return res.status(200).json('Comentário inserido com sucesso.');

    } catch (error) {
        return res.status(400).json(`Erro interno do servidor: /n${error.message}`);
    }
}


const feed = async (req, res) => {
    const { id } = req.user;
    const { page } = req.query;

    const offset = page ? page * 10 : 0; // Leitura: Se informado 'offset', page = offset, senão page = 0;

    try {
        const posts = await knex('postagens')
            .where('usuario_id', '!=', id)
            .limit(10)
            .offset(offset);

        if (posts.length === 0) {
            return res.status(200).json(posts);
        }

        for (const post of posts) {
            //Infos do usuário
            const user = await knex('usuarios')
                .where({ id: post.usuario_id })
                .select('imagem', 'username', 'verificado')
                .first();

            post.user = user;

            //Fotos
            const photos = await knex('postagem_fotos')
                .where({ postagem_id: post.id })
                .select('imagem');

            post.fotos = photos;

            //Curtidas
            const likes = await knex('postagem_curtidas')
                .where({ postagem_id: post.id })
                .select('usuario_id');

            post.curtidas = likes.length;

            //Curtido por mim?
            post.curtidoPorMim = likes.find(like => like.usuario_id === id) ? true : false;

            //Comentarios
            const comments = await knex('postagem_comentarios') // Leitura: pegamos tudo da tabela da 
                // esquerda 'postagem_comentarios' e juntamos com a tabela da direita 'usuarios', onde 
                // 'usuario.id' seja igual a 'postagem_comentarios.usuario_id'.
                .leftJoin('usuarios', 'usuarios.id', 'postagem_comentarios.usuario_id')
                .where({ postagem_id: post.id })
                .select('usuarios.username', 'postagem_comentarios.texto');

            post.comentarios = comments;
        }

        return res.status(200).json(posts);

    } catch (error) {
        return res.status(400).json(`Erro interno do servidor: /n${error.message}`);
    }
}

module.exports = {
    newPost,
    like,
    comment,
    feed
}
