create table usuarios (
	id serial primary key,
    nome text not null,
    email text unique not null,
  	genero text,
  	telefone text,
    imagem text,
    site text,
    bio text,
    verificado boolean default false,
  	senha text not null
);

create table postagens (
    id serial primary key,
    usuario_id int not null,
    data timestamptz default now(),
    texto text,
  	foreign key (usuario_id) references usuarios(id)
);

create table postagem_fotos (
    id serial primary key,
    postagem_id int not null,
    imagem text not null,
  	foreign key (postagem_id) references postagens(id)
);

create table postagem_comentarios (
    id serial primary key,
    texto text not null,
    data timestamptz default now(),
    usuario_id int not null,
    postagem_id int not null,
  	foreign key (usuario_id) references usuarios(id),
  	foreign key (postagem_id) references postagens(id)
);

create table postagem_curtidas (
    usuario_id int not null,
    postagem_id int not null,
    data timestamptz default now(),
  	foreign key (usuario_id) references usuarios(id),
  	foreign key (postagem_id) references postagens(id)
);