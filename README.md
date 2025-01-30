# In.Orbit - Aplicativo de gerenciamento de metas semanais

Rocketseat NLW-Pocket#17
API - Node | Fastify | Docker | PostgreSQL

![banner]()

# Sumário

- [Dependências](#dependencias);
- [Dependências de Desenvolvimento](#dependencias-de-desenvolvimento);
- [Objetivos do Projeto](#objetivos-do-projeto);
- [Rotas](#rotas)
- [Como executar o projeto](#como-executar-o-projeto);
- [Autor](#contatos-do-autor)

## Dependências

- [Fastify](https://fastify.dev): Framework web para Node.js usado para criar APIs e servidores HTTP (similar ao Express.js) e possio suporte à tipagem TypeScript.

- [Docker](https://www.docker.com/): Cria um ambiente isolado para rodar o banco de dados escolhido. Facilita a configuração e o gerenciamento do banco, garantindo consistência no ambiente.

- [Drizzle](https://orm.drizzle.team/):

  - Drizzle-orm: Fornece uma camada de ORM para facilitar a interação com o banco de dados em TypeScript, abstraindo a sintaxe SQL.
  - Drizzle-kit: Ferramenta de migração do drizzle-orm usada para gerenciar alterações no esquema do banco de dados.

- [Zod](https://zod.dev/): Valida esquemas que garante a segurança dos dados. Valida dados de formulário, variáveis de ambiente e muito mais.

- [@paralleldrive/cuid2](https://github.com/paralleldrive/cuid2): Algoritmo gerador de IDs únicos para os dados no banco de dados.

- [ESLint](https://eslint.org/): Ferramenta para análise de código, responsável por identificar erros e inconsistências, como variáveis não utilizadas ou não declaradas.

- [Prettier](https://prettier.io/): Ferramenta de formatação de código como indentação, espaçamento, uso de aspas simples ou duplas, etc, garantindo consistência no estilo do código.

- [DayJS](https://day.js.org/en/): Analisa, valida, manipula e mostra datas e horários. Ideal para realizar operações com datas, como formatação, comparação ou adição de dias/semanas/meses, etc.

- [Fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod): Integra o **Zod** com o **Fastify**, permitindo validar e tipar dados das requisições HTTP para evitar erros. Usa validações do Zod para definir e validar o `body`, `params`, `query` e `headers` das requisições.

- [@fastify/cors](https://github.com/fastify/fastify-cors): Plugin do Fastify que configura o CORS (Cross-Origin Resource Sharing), uma medida de segurança que limita o acesso ao backend, permitindo apenas frontends específicos.

- [Thunder Client](https://www.thunderclient.com): Extensão do VS Code, usada para testar APIs REST diretamente no editor, similar ao Postman. Usado para testar endpoints da aplicação.

- [@fastify/swagger](https://github.com/fastify/fastify-swagger): Gerar automaticamente a documentação da API no formato OpenAPI (Swagger) com base nas rotas e esquemas definidos no Fastify.

- [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui): Fornecer uma interface gráfica interativa (UI) para visualizar e testar a documentação da API gerada pelo fastify/swagger.

## Objetivos do projeto

- Criar o servidor com Fastify e Node.js para criação de Rotas
  - Cadastrar metas
  - Marcar metas como concluidas
  - Retorna os dados da minha semana (resumo semanal)
  - Metas que foram e ainda não foram completadas
- Criar o banco de dados utilizando Docker e PostgreSQL
- Criar funções que utilizem das rotas para atualizar o banco de dados
- Utilizar a lib ZOD para verificação dos dados nas variáveis de ambiente e dados nas requisições HTTP

## Rotas

- A API possui documentação com Swagger e Swagger-UI
- Rode o servidor e acesse a rota `/docs` para visualizar as rotas, query, params e envios ao body, além do retorno das rotas.

## Como executar o projeto

**1. Requisitos:**

    - Ter [Node.JS](https://nodejs.org/pt) instalado em sua máquina
    - Ter [Docker](https://www.docker.com/products/docker-desktop/) instalado em sua máquina.

**2. Instalar as dependências:**

    - Instalar as dependências executar o comando `npm install` dentro da pasta "./server".

**3. Variáveis de ambiente**

- Criar um arquivo `.env` na raiz do projeto e adicionar a url do banco de dados. Ela segue este padrão:

```md
DATABASE_URL=<DATABASE>://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
```

- DATABASE: Nome do banco de dados - postgresql
- Os próximos dados definimos no nosso docker-compose.yml

```yml
name: pocket-js-server

services:
  pg:
    image: bitnami/postgresql:13.16.0
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=inorbit
```

- USER: docker
- PASSWORD: docker
- HOST: Em ambiente desenvolvimento normalmente utilizado o localhost, um host local na nossa máquina
- PORT: 5432 (é a nossa porta/port)
- DATABASE: inorbit

O resultado seria:

```env
DATABASE_URL=postgresql://docker:docker@localhost:5432/inorbit
```

- No nosso caso, o banco de dados será criado dentro da nossa máquina, somente para estudos e aprendizado, mas este tipo de informação não deve ser compartilhada.

**4. Inicializar o banco de dados**

- Dentro da pasta "./server" executar o comando `docker compose up -d` para rodar o bando de dados no Docker

- A partir daqui, caso você tenha, por exemplo, o PostgreSQL instalado globalmente na sua máquina, pode haver conflito de dados com o container PostgreSQL do Docker, como senha e nome de usuário, sendo um impediditivo para a migração e criação do esquema do banco. Caso enfrente algum problema de "senha incorreta" ou algum erro similar ao tentar realizar os próximos dados abaixo, acesse o seu **Gerenciador de tarefas** e vá em serviços e procure pelo seu banco de dados instalado e pare o serviço do banco:

  <img src="./src/assets/imgs/tasksManager.png" alt="Serviços do Gerenciador de Tarefas">

- Inicialize o container:
  - `docker ps -a`: colete o ID do container criado
  - `docker start <container_id>`: Execute o comando, substituindo o `<container_id>`, pelo ID copiado.  

**5. Migração do esquema para o banco de dados**

- Crie uma nova migração do banco de dados utilizando o comando `npx drizzle-kit migrate`. A migração só ocorrerá com sucesso se o banco de dados já estiver em andamento.

**6. Inicializar o servidor**

- Execute o comando `npm run server:dev` para iniciar o servidor. Se o servidor não estiver rodando, as requisições de dados não serão feitas.


## Autor

- GitHub - [Felipe Santiago Morais](https://github.com/SantiagoMorais)
- Linkedin - [Felipe Santiago](https://www.linkedin.com/in/felipe-santiago-873025288/)
- Instagram - [@felipe.santiago.morais](https://www.instagram.com/felipe.santiago.morais)
- Email - <a href="mailto:contatofelipesantiago@gmail.com" target="blank">contatofelipesantiago@gmail.com</a>
