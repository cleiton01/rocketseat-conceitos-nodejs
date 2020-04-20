const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  console.log(techs);
  const newRepo = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  console.log(newRepo);
  repositories.push(newRepo);
  
  response.json(newRepo)
});

app.put("/repositories/:id", (request, response) => {
  // usado o find mas esse tipo de busca leva mais tempo
  // correto aqui é alterar a estrutura inicial para busca por chave, usando o hash value.
  const repository = repositories.find(record => record.id == request.params.id);
  
  // valida se retornou algo na busca, caso nao, entao retorna message de error.
  if(!repository){
    return response.status(400).json({message: "Repository do not exists!"});
  }

  // atualiza sem considerar o valor atual da variavel, 
  // com isso os valores pode ser vazio
  repository["title"] = request.body.title; 
  repository["url"] = request.body.url; 
  repository["techs"] = request.body.techs; 
  response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  /* 
    usado o find mas esse tipo de busca leva mais tempo, 
    quando comparado com outras formas de busca.
    Mas devido ao volume ser baixo(apenas um exercicio), sera mantido o find.
    O melhor seria uma busca por chave, usando o uuid criado,
    ou metodos que permita particionamento para melhor escalabidade.
  */
  // encontra a posicao do elemento no array.
  const repositoryPossition = repositories.findIndex(record => record.id == request.params.id);
  console.log(repositoryPossition);
  // valida se retornou algo na busca, caso nao, entao retorna message de error.
  if(repositoryPossition == -1){
    return response.status(400).json();
  }
  // remove apenas a posicao correte.
  repositories.splice(repositoryPossition,1);

  response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  let repository = repositories.find(record => record.id == request.params.id);
  
  // valida se retornou algo na busca, caso nao, entao retorna message de error.
  if(!repository){
    return response.status(400).json({message: "Repository do not exists!"});
  }
  // para cada chamada da API sera adicionado 1 like
  repository["likes"] +=1;

  return response.json({likes: repository["likes"]});
});

module.exports = app;
