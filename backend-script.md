# Script Momento Síncrono - Revisão Rubrica de Back-end

## Preparando o Ambiente de Desenvolvimento

Os passos abaixo necessitam que você possua instalado o _Node.js_ versão 16.0.0 ou mais recente e o _Docker_ e a ferramenta _docker-compose_.

### Criação do Projeto

1. Criar e entrar no diretório do projeto

```js
mkdir acelera-trybe-psel
mkdir acelera-trybe-psel/backend
cd acelera-trybe-psel/backend
```

2. Inicializar projeto NPM

```js
npm init -y
```

3. Instalar as dependências do projeto

```js
npm install cors@2.8.5 dotenv@16.0.3 express@4.17.1 joi@17.8.4 jsonwebtoken@8.5.1 mysql2@3.2.0
```

4. Instalar as dependências de desenvolvimento

```js
npm install -D sinon@15.0.2 chai@4.3.7 chai-http@4.3.0 eslint-config-trybe-backend@2.1.0 frisby@2.1.3 mocha@10.2.0 nodemon@2.0.21 nyc@15.1.0
```

5. Realizar as seguintes alterações no **package.json**

```js
...
"engines": {
  "node":">=16.0.0"
},
"main": "src/server.js",
"scripts": {
  "start": "node .",
  "dev": "nodemon --inspect=0.0.0.0:9229 .",
  "coverage": "nyc --all --include src/models --include src/services --include src/controllers mocha tests/**/*.js --exit",
  "postcoverage": "rm -rf .nyc_output",
  "test": "mocha ./tests/**/*.test.js --exit",
  "unit": "mocha ./tests/unit/*.test.js --exit"
},
...
```

6. Criar o arquivo **.eslintrc.json** com o seguinte conteúdo:

```json
{
  "extends": "trybe-backend",
  "rules": {
    "indent": [
      "warn",
      2
    ],
    "prefer-arrow-callback": "off"
  },
  "overrides": [
    {
      "files": [
        "*.test.js"
      ],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ]
}
```

7. Criar o subdiretório **src** dentro do projeto com os arquivos **server.js** e **app.js**

8. Adicionar o seguinte conteúdo ao arquivo **src/app.js**:
   
```js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Verificação de saúde da aplicação
app.get('/health', (_req, res) => res.status(200).json({ message: 'I\'m alive' }));


// Retorna uma resposta de erro 501 para
// endpoints não implementados
app.all('*', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Adiciona um middleware de erro que realiza
// o tratamento de erros da aplicação
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'internal error' }); 
});

module.exports = app;
```

8. Adicionar o seguinte conteúdo no arquivo **src/server,js**

```js
const app = require('./app');

const PORT = 3001;
app.listen(PORT, () => console.log(`server on ${PORT}`));
```

### Criação do Banco de Dados com Docker

1. Criar o arquivo **database.sql** na raiz do projeto (o conteúdo deste arquivo será adicionado mais adiante);

2. Criar o arquivo **.dockerignore** na raiz do projeto com o seguinte conteúdo:

```bash
**/.classpath
**/.dockerignore
**/.env
**/.git
**/.gitignore
**/.project
**/.settings
**/.toolstarget
**/.vs
**/.vscode
**/*.*proj.user
**/*.dbmdl
**/*.jfm
**/charts
**/docker-compose*
**/compose*
**/Dockerfile*
**/node_modules
**/npm-debug.log
**/obj
**/secrets.dev.yaml
**/values.dev.yaml
LICENSE
README.md
```

3. Adicionar o arquivo **DockerfileMySQL** na raiz do projeto com o seguinte conteúdo:

```dockerfile
FROM mysql:8.0.32

COPY /database.sql /docker-entrypoint-initdb.d
```

4. Adicionar o arquivo **docker-compose.yml** na raiz do projeto:

```yaml
version: '3'

services:
  node:
    image: node:16-alpine
    container_name: bank
    ports:
      - 3001:3001
      - 9229:9229
    volumes:
      - ./:/app
    working_dir: /app
    tty: true
    stdin_open: true
    depends_on:
      db:
        condition: service_healthy
    environment:
      - name=value
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_DATABASE=bank
      - JWT_SECRET='super-secret-bank'
  db:
    build: 
      context: ./
      dockerfile: DockerfileMySQL
    container_name: bank_db
    environment:
      - MYSQL_ROOT_PASSWORD=password
    ports:
      - 3306:3306
    healthcheck:
      test: mysqladmin ping -u root -p$MYSQL_ROOT_PASSWORD
      interval: 15s
      timeout: 15s
      retries: 5
      start_period: 15s
```

5. Para iniciar o container do projeto e do banco de dados, digite o seguinte comando:

```bash
docker compose up -d --build
```

Caso deseje apenas iniciar o banco de dados, use o seguinte comando:

```bash
docker compose up -d db --build
```

P.S.: A opção `--build` fará com que o docker compose recrie o container do _MySQL_ quando executar um dos comandos acima.

## Fluxo Conta

### Requisito 01

> Criar uma conta
>
> - A conta deve ter, pelo menos, os campos CPF ou CNPJ, name, email, password e status da conta;
> - O status da conta deve ter valor binário que represente ativo ou inativo.
> - O CPF ou CNPJ devem ser valores válidos, isto é, os dígitos verificadores devem validar o documento.
>

Vamos dividir o requisito em problemas menores e, ao concluirmos todos os problemas menores, teremos concluído o objetivo do requisito.

Podemos dividir o problema em:

1. Criar a tabela **account** no banco de dados para representar uma conta.
2. Criar a camada **model** que possui um componente chamado **account.model.js** que realiza a persistência de uma conta a partir de um _JSON_;
3. Criar a camada **service** que possui um componente chamado **account.service.js** que realiza a validação do CPF ou CNPJ;
4. Criar a camada **controller** que possui os componentes **account.controller.js** e **account.routes.js** os quais recebem a requisição e realizam o roteamento especificamente;
5. Registrar o **account.routes.js** em nosso **app.js**

Vamos executar cada um dos passos acima descritos.

#### 1 - Criar a tabela **account** no banco de dados para representar uma conta

A tabela deve conter os campos:

1. **id**: Campo do tipo inteiro que representa a chave primária da tabela;
2. **identifier**: Campo do tipo _varchar_ que representa o _CPF_ ou _CNPJ_ vinculado a conta;
3. **name**: Campo do tipo _varchar_ que representa o nome da pessoa ou empresa que está vinculado a conta;
4. **status**: Campo do tipo _booleano_ que representa o estado da conta.

Vamos adicionar o seguinte conteúdo no arquivo **database.sql** que está na raiz do projeto:

```sql
DROP DATABASE IF EXISTS bank;
CREATE DATABASE IF NOT EXISTS bank;

USE bank;

CREATE table IF NOT EXISTS accounts (
  `id` INT PRIMARY KEY auto_increment,
  `identifier` VARCHAR(255) UNIQUE NOT NULL, 
  `name` VARCHAR(255) NOT NULL, 
  `email` VARCHAR(255) NOT NULL, 
  `password` VARCHAR(255) NOT NULL,
  `status`  boolean default true
);
```

As instruções _SQL_ acima ao serem executadas: removem o banco de dados **bank** caso existir; cria o banco de dados **bank** caso não existir; solicita o uso do banco **bank** e; cria a tabela **accounts** caso não existir.

Após adicionar as instruções _SQL_ acima no arquivo **database.sql**, salve o arquivo e reinicie os containers com o _docker compose_. No processo de inicialização o container com o banco de dados irá ler a nova versão do arquivo **database.sql** e irá executa-lo, realizando a criação da tabela **bank**.

#### 2 - Criar a camada **model** que possui um componente chamado **account.model.js** que realiza a persistência de uma conta a partir de um _JSON_

Vamos criar o subdiretório **models** dentro do diretório **src**. Em seguida vamos criar o arquivo **src/models/connection.js** com o seguinte conteúdo:

```js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = connection;
```

O código acima utiliza o módulo _mysql2_ para criar o objeto de conexão com o _MySQL_. Esse objeto será utilizado em nosso models para executar instruções _SQL_ em nosso banco de dados.

Em seguida vamos criar o arquivo **src/models/account.model.js** com o seguinte conteúdo:

```js
const connection = require('./connection');

const create = async ({ identifier, name, email, password, status }) => {
  const [rows] = await connection.execute(`
    INSERT INTO accounts
      (identifier, name, email, password, status)
    VALUES (?, ?, ?, ?, ?);
  `, [identifier, name, email, password, status]);

  return { id: rows.insertId, identifier, name, email, status };
};

const isExists = async (identifier) => {
  const [rows] = await connection.execute(`
    SELECT * FROM accounts WHERE identifier = ? and status = 1;
  `, [identifier]);
  return !!rows[0];
}; 

module.exports = { create, isExists };
```

O código acima cria as funções **create** e **isExists** responsáveis por, inserir uma nova conta no banco de dados e por verificar se um identificador já está cadastrado no banco, respectivamente.

#### 3 - Criar a camada **service** que possui um componente chamado **account.service.js** que realiza a validação do CPF ou CNPJ

Vamos instalar uma dependência em nosso projeto capaz de validar _CPF_ e _CNPJ_

```bash
npm install validation-br
```

Agora, vamos criar o subdiretório **services** dentro do diretório **src**. Em seguida vamos criar o arquivo **src/services/account.service.js** com o seguinte conteúdo:

```js
const { isCPF, isCNPJ } = require('validation-br');

const accountModel = require('../models/account.model');

const create = async ({ identifier, name, email, password, status }) => {

  if (isCPF(identifier) || isCNPJ(identifier)) {

    if (await accountModel.isExists(identifier)) {
      console.log('Identificador já cadastrado');
      return null;
    }

    const account = await accountModel.create({
      identifier,
      name,
      email,
      password,
      status,
    });

    return account;
  }

  return null;
};

module.exports = { create };
```

#### 4 - Criar a camada **controller** que possui os componentes **account.controller.js** e **account.routes.js** os quais recebem a requisição e realizam o roteamento especificamente

Primeiramente vamos criar os subdiretórios **controllers** e **routes** dentro do diretório **src**.

Agora vamos criar o arquivo **account.controller.js** com o seguinte conteúdo:

```js
const service = require('../services/account.service');

const create = async (req, res) => {
  const { identifier, name, email, password, status } = req.body;
  const account = await service.create({ identifier, name, email, password, status });

  if(!account) { return res.status(500).json({message: "Ocorreu um erro interno"}); }

  return res.status(201).json(account);
};

module.exports = { create };
```

Depois vamos criar o arquivo **src/routes/account.route.js** com o seguinte conteúdo:

```js
const express = require('express');

const accountController = require('../controllers/account.controller');

const accountRouter = express.Router();

accountRouter.post('/', accountController.create);

module.exports = accountRouter;
```

Para finalizar, devemos declarar o arquivo de rotas criado acima em **src/app.js**

```js
// ...
// ...
const accountRouter = require('./routes/account.route');
// ...

//app.get('/health', (_req, res) => res.status(200).json({ message: 'I\'m alive' }));

app.use('/accounts', accountRouter);

// ...
// ...
// ...
```

### Requisito 02

> Alterar uma conta
>
> - Não é permitido alterar CPF/CNPJ
> - Apenas é permitido alteração por acessos autenticados

Este requisito além de solicitar um _endpoint_ para realizar a alteração de uma conta (com exceção do CPF, CNPJ), também requer que seja implementado um _endpoint_ para realizar a autenticação na _API_ retornando um **token**. Vamos utilizar o _JWT_ para gerar o token e validar o mesmo.

Então vamos dividir este requisito em duas partes:

1. Criar o **endpoint** `POST /login` responsável por autenticar uma conta;
2. Criar o **endpoint** `PUT /accounts` responsável por alterar os dados de uma conta;
3. Fazer com que o _endpoint_ `PUT /accounts` seja autenticado;

#### 1 - Criar o endpoint POST /login

Vamos adicionar no arquivo **src/models/account.model.js** o seguinte conteúdo:

```js
// ...
// ...
// ...

const findAccountByIdentifier = async (identifier) => {
  const [rows] = await connection.execute(
    `SELECT * FROM accounts WHERE identifier = ? and status = 1;`,
    [identifier]);

  return rows[0];
};

module.exports = { 
  //create, 
  //isAccountExists, 
  findAccountByIdentifier };
```

O trecho de código acima adiciona uma função capaz de buscar por uma conta ativa através do seu identificador.

Em seguida, vamos criar o arquivo **src/services/login.service.js** o qual será responsável por gerenciar os serviços de autenticação e validação do token com o seguinte conteúdo.

```js
const jwt = require('jsonwebtoken');

const accountModel = require('../models/account.model');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecret';
const JWT_CONFIG = { expiresIn: '15m', algorithm: 'HS256' };

const login = async ({ identifier, password }) => {
  const account = await accountModel.findAccountByIdentifier(identifier);

  if (!account || account.password !== password) {
    return null;
  }

  const token = createToken({ id: account.id, status: account.status });
  return token;
};

const createToken = (payload) => jwt.sign(payload, JWT_SECRET, JWT_CONFIG);

const verifyToken = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
};

module.exports = { login, createToken, verifyToken };
```

No trecho de código acima, foram definidas as funções **login**, **createToken** e **validateToken**. A função _login_ é responsável por realizar o processo de autenticação de uma conta. A função _createToken_ realiza a criação de um token _JWT_, enquanto a função _validateToken_ verifica se um token _JWT_ é válido.

Agora, vamos criar o arquivo **src/controllers/login.controller.js** com o seguinte conteúdo:

```js
const loginService = require('../services/login.service');

const login = async (req, res) => {
  const { identifier, password } = req.body;

  const token = await loginService.login({ identifier, password });

  if (token) {
    return res.status(200).json({ token });
  } else {
    return res
      .status(401)
      .json({ message: 'Identificador ou senha inválidos' });
  }
};

module.exports = { login };
```

NO trecho de código acima, é criada a função _login_ na qual recebe a requisição, extrai o identificador e a senha do corpo da requisição (JSON), envia para o serviço esses dados para realizar o processo de autenticação e, em caso de sucesso, responde com o token ou, em caso de falha, envia uma mensagem de erro.

Vamos criar o arquivo **src/routes/login/route.js** com o seguinte conteúdo:

```js
const express = require('express');

const loginController = require('../controllers/login.controller');

const loginRouter = express.Router();

loginRouter.post('/', loginController.login);

module.exports = loginRouter;
```

No trecho de código acima é criado o _endpoint_ login, o qual realiza a chamada da função _login_ do _loginController_.

Para finalizar, vamos declarar a nova rota no arquivo **src/app.js**: 

```js
// ...
// ...
// const accountRouter = require('./routes/account.route');
const loginRouter = require('./routes/login.route');
// ...

//app.get('/health', (_req, res) => res.status(200).json({ message: 'I\'m alive' }));

// app.use('/accounts', accountRouter);
app.use('/login', accountRouter);

// ...
// ...
// ...
```

#### 2 - Criar o **endpoint** `PUT /accounts` responsável por alterar os dados de uma conta

Vamos adicionar no arquivo **src/models/account.model.js** o seguinte trecho de código:

```js
// ...
// ...
// ...

const update = async ({ identifier, name, email, status, password }) => {
  const [rows] = await connection.execute(
    `
    UPDATE  accounts SET
      name = ?, 
      email = ?,
      password = ?,
      status = ? 
    WHERE identifier = ? and status = true;
  `,
    [name, email, password, status, identifier],
  );

  if (!rows.changedRows) return null;
  return { identifier, name, email, status };
};

module.exports = { 
  //create, 
  //isAccountExists, 
  //findAccountByIdentifier,
  update };
```

O trecho acima realiza a atualização de um registro ativo a partir do identificador. Note que apenas os campos **name**, **email**, **password** e **status** estão sendo alterados.

Em seguida, vamos adicionar o seguinte trecho de código no arquivo **src/services/account.service.js**:

```js
// ...
// ...
// ...

const update = async ({ identifier, name, email, password, status }) => {

  const result = await accountModel.update({identifier, name, email, password, status});
  
  if(result == 0) {
    return null;
  }

  return identifier;

};

module.exports = { 
  // create, 
  update };
```

Agora vamos adicionar o seguinte trecho de conteúdo no arquivo **src/controllers/account.controller.js**:

```js
// ...
// ...
// ...

const update = async (req, res) => {
  const { identifier, name, email, password, status } = req.body;
  const result = await service.update({ identifier, name, email, password, status });

  if(!result) { return res.status(200).json({ message: "Nada alterado" }); }

  return res.status(201).json({ message: `Conta de identificador ${result} alterada com sucesso!` });
}

module.exports = { 
  //create,
  update };
```

E por fim, adicionar o seguinte trecho de código no arquivo **src/routes/account.route.js**:

```js
const express = require('express');

const accountController = require('../controllers/account.controller');

const accountRouter = express.Router();

accountRouter.post('/', accountController.create);
accountRouter.put('/', accountController.update);

module.exports = accountRouter;
```

#### 3 - Fazer com que o endpoint PUT /accounts seja autenticado

Primeiramente vamos criar o subdiretório **middlewares** dentro do diretório **src**. Depois vamos criar o arquivo **src/middlewares/auth.middleware.js** com o seguinte conteúdo:

```js
const { verifyToken } = require('../services/login.service');

const authMiddleware = (req, res, next) => {
  try{
    const { authorization } = req.headers;
    const payload = verifyToken(authorization);
    req.account = { 
      accountId: payload.id,
      status: payload.status, 
      isAdmin: payload.isAdmin,
    };
    next();
  } catch (error){
    res.status(401).json({message: 'Token inválido'})
  }
    
};

module.exports = authMiddleware;
```
O trecho de código acima cria um _middleware_ que verifica a existência do token no cabeçalho (chave _autorization_) e, em seguida, verifica se o _token_ é válido. Caso o _token_ seja válido, a requisição prossegue, caso contrário é enviado uma resposta informando que o token é inválido.

Em seguida vamos adicionar o seguinte código no arquivo **src/routes/account.routes.js**:

```js
// ...
// ...
const authMiddleware = require('../middlewares/auth.middleware');
//const accountController = require('../controllers/account.controller');
// ...

//accountRouter.post('/', accountController.create);
accountRouter.put('/', authMiddleware, accountController.update);

// module.exports = accountRouter;
```

Note que foi adicionado o _middleware_ na rota referente a atualização da conta. Após isso teremos uma rota autenticada e os demais requisitos que demandem uma rota autenticada, basta adicionar o _middleware_ na definição de rota.

### Requisito 03

> Deletar uma conta
>
> - O delete deve ser lógico, isto é, o status da conta deve ser colocado em inativo.
> - Apenas é permitido deletar a conta por acessos autenticados

Para atender esse requisito, precisamos criar:

1. Adicionar uma nova função no arquivo **src/models/account.model.js** que realize a exclusão lógica (mudar o valor do status para _false_);
2. Adicionar uma nova função no arquivo **src/services/account.service.js** que define o serviço de exclusão;
3. Adicionar uma nova função no arquivo **src/controller/account.controller.js** que define o controlador da requisição;
4. Adicionar uma nova rota `DELETE /account` no arquivo **src/routes/account.route.js** com o _middleware_ de autenticação;

#### 1 - Adicionar uma nova função no arquivo src/models/account.model.js que realize a exclusão lógica

No arquivo **src/models/account.model.js** vamos adicionar o seguinte conteúdo:

```js
// ...
// ...
// ...

const logicalDelete = async ({ identifier }) => {
  const [rows] = await connection.execute(
    `UPDATE  accounts SET 
      status = false 
    WHERE identifier = ? and status = true;`,
    [identifier],
  );
  return rows.changedRows;
};

module.exports = { 
  // create,
  // isAccountExists,
  // findAccountByIdentifier,
  // update,
  logicalDelete };
```

No trecho de código acima é adicionado a função **logicalDelete** que realiza a exclusão lógica de uma conta no banco de dados.

Agora, vamos adicionar o seguinte código no arquivo **src/services/account.service.js**:

```js
// ...
// ...
// ...

const logicalDelete = async ({ identifier }) => {
  const result = await accountModel.logicalDelete(identifier);
  if (result == 0) return null;
  return identifier;
};

module.exports = { 
  // create,
  // update, 
  logicalDelete };
```

No trecho de código acima foi adicionado a função **logicalDelete** que realiza o procedimento de exclusão lógica através da chamada ao model. Se o registro for alterado é retornado o identificador do mesmo, caso contrário é retornado null.

Vamos adicionar o seguinte trecho de código no arquivo **src/controllers/account.controller.js**:

```js
// ...
// ...
// ...

const logicalDelete = async (req, res) => {
  const { identifier } = req.body;
  const result = await service.logicalDelete({ identifier });

  if (!result) {
    return res.status(200).json({ message: 'Nada alterado' });
  }

  return res
    .status(201)
    .json({
      message: `Conta de identificador ${result} foi excluída com sucesso!`,
    });
};

module.exports = { 
  // create,
  // update,
  logicalDelete };
```

Por fim, vamos adicionar o seguinte código no arquivo **src/routes/account.route.js**:

```js
// ...
// ...
// ...

// accountRouter.post('/', accountController.create);
// accountRouter.put('/', authMiddleware, accountController.update);
accountRouter.delete('/', authMiddleware, accountController.logicalDelete);

//module.exports = accountRouter;
```

## Fluxo transações

### Requisito 04

> Registrar pagamento
>
> - Apenas é permitido registrar pagamento por acessos autenticados
> - Não é possível registrar pagamento caso a conta esteja inativa
> - Deverá receber um identificador da conta com o valor e data da transação e retornar um identificador da transação

Para atender a este requisito, temos:

1. Criar a tabela de pagamentos
2. Criar o model de pagamentos
3. Criar o serviço de pagamentos
4. Criar o controlador de pagamentos
5. Criar as rotas de pagamentos
6. Registrar as rotas de pagamentos no arquivo **src/app.js**

#### 1 - Criar a tabela de pagamentos

Vamos adicionar o conteúdo a seguir no final do arquivo **database.sql** que está na raiz do projeto:

```sql
// ...
// ...
// ...

CREATE table IF NOT EXISTS transactions (
  `transactionId` INT PRIMARY KEY auto_increment,
  `accountId` INT NOT NULL, 
  `cashback` DOUBLE DEFAULT NULL, 
  `value` DOUBLE NOT NULL, 
  `date`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

O trecho _SQL_ acima criará uma nova tabela chamada **transactions** que sera responsável por armazenar os pagamentos. Para que o mesmo seja executado no _MySQL_, devemos reiniciar o container com o banco de dados para que o arquivo **database.sql** seja lido e executado.

#### 2 - Criar o model de pagamentos

Em seguida vamos criar o arquivo **src/models/transaction.model.js** com o seguinte conteúdo:

```js
const connection = require('./connection');

const create = async ({ accountId, value }) => {
  const date = new Date();
  const [rows] = await connection.execute(
    `INSERT INTO transactions (accountId, value, date)
    VALUES (?, ?, ?);`,
    [accountId, value, date],
  );

  return { transactionId: rows.insertId, accountId, value, date };
};

module.exports = { create }
```

#### 3 - Criar o serviço de pagamentos

Vamos criar o arquivo **src/services/transaction.service.js** com o seguinte conteúdo

```js
const transactionModel = require('../models/transaction.model');

const create = async ({ accountId, value }) => {
  return await transactionModel.create({ accountId, value });
};

module.exports = { create };
```
No trecho de código acima foi criado o serviço de criação de transações.

#### 4 - Criar o controlador de pagamentos


Agora vamos criar o arquivo **src/controllers/transaction.controller.js** com o seguinte conteúdo:

```js
const service = require('../services/transaction.service');

const create = async (req, res) => {
  const { accountId, value } = req.body;
  const transaction = await service.create({ accountId, value });

  res.status(201).json(transaction);
};

module.exports = { create };
```

#### 5 - Criar as rotas de pagamentos

Neste ponto, temos que criar a rota para o nosso controlador. Vamos criar o arquivo **src/routes/transaction.route.js** com o seguinte conteúdo:

```js
const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

const transactionRouter = express.Router();

transactionRouter.post('/', authMiddleware, transactionController.create);

module.exports = transactionRouter;
```

#### 6 - Registrar as rotas de pagamentos no arquivo src/app.js


Para finalizar vamos declarar a rota criada no arquivo **src/app.js**:

```js
// ...
// ...
// const accountRouter = require('./routes/account.route');
// const loginRouter = require('./routes/login.route');
const transactionRouter = require('./routes/transaction.route');
// ...

//app.get('/health', (_req, res) => res.status(200).json({ message: 'I\'m alive' }));

// app.use('/accounts', accountRouter);
// app.use('/login', accountRouter);
app.use('/transactions', transactionRouter);

// ...
// ...
// ...
```

### Requisito 05

> Registrar uma taxa de cashback
>
> - Apenas é permitido registrar cashback por acessos autenticados
> - Não é possível registrar um cashback caso a conta esteja inativa
> - Deverá receber como entrada o identificador da transação e a taxa de cashback

Para atender esse requisito, precisamos criar:

1. Adicionar uma nova função no arquivo **src/models/transaction.model.js** que atualize uma transação com as informações de _cash back_;
2. Adicionar uma nova função no arquivo **src/services/transaction.service.js** que define o serviço inclusão de _cash back_;
3. Adicionar uma nova função no arquivo **src/controller/transaction.controller.js** que define o controlador da requisição;
4. Adicionar uma nova rota `PUT /transactions/cashback` no arquivo **src/routes/transaction.route.js** com o _middleware_ de autenticação;

#### 1 - Adicionar uma nova função no arquivo src/models/transaction.model.js que atualize uma transação com as informações de cash back

Vamos adicionar no arquivo **src/models/transactions.model.js** o seguinte conteúdo:

```js
// ...
// ...
// ...

const setCashback = async ({ transactionId, cashback }) => {
  const [rows] = await connection.execute(
    `UPDATE transactions
      SET cashback = ?
    WHERE transactionId = ?;`,
    [cashback, transactionId],
  );

  return !!rows.changedRows;
};

module.exports = { 
  // create, 
  setCashback
};
```

#### 2 - Adicionar uma nova função no arquivo src/services/transaction.service.js que define o serviço inclusão de cash back

No arquivo **src/services/transaction.service.js** vamos adicionar o seguinte código:

```js
// ...
// ...
// ...

const setCashback = async ({ transactionId, cashback }) => {
  const transaction = await transactionModel.setCashback({ transactionId, cashback });
  if (!transaction) return null
  return transaction;
};

module.exports = { 
  // create,
  setCashback 
};
```

#### 3 - Adicionar uma nova função no arquivo src/controller/transaction.controller.js que define o controlador da requisição

Vamos adicionar no arquivo **src/controller/transaction.controller.js** o seguinte trecho de código: 

```js
const setCashback = async (req, res) => {
  const { transactionId, cashback } = req.body;  
  const transaction = await service.createCashback({ transactionId, cashback });

  if(!transaction) {
    return res.status(400).json({ message: 'Nenhum registro afetado' });
  }
  
  res.status(200).json({ message: 'Cashback registrado com sucesso!' });
};

module.exports = { create, setCashback };
```

#### 4 - Adicionar uma nova rota PUT /transactions/cashback no arquivo src/routes/transaction.route.js com o middleware de autenticação

Por fim adicionar a rota autenticada no arquivo **src/routes/transaction.rules.js**:

```js
// const express = require('express');

// const authMiddleware = require('../middlewares/auth.middleware');
// const transactionController = require('../controllers/transaction.controller');

// const transactionRouter = express.Router();

// transactionRouter.post('/', authMiddleware, transactionController.create);
transactionRouter.put('/', authMiddleware, transactionController.setCashback);

// module.exports = transactionRouter;
```

### Requisito 06

> Listar o extrato das transações
>
> - Apenas é permitido listar extrato por acessos autenticados
> - Não é possível listar extrato caso a conta esteja inativa
> - Deve listar todas as transações realizadas na conta com seus devidos cashbacks
> - Exemplo de resposta:
>
>```json
>[
>    {
>        "transactionId": 123123123345453567765734,
>        "accountId": "123475789-10",
>        "date": "2023-03-08T12:48:25.000Z",
>        "value": 105.39,
>        "cashback": 0.02,
>    },
>    {
>        "transactionId": 897609876572398740237613,
>        "documento": "123475789-10",
>        "date": "2023-03-09T09:23:58.000Z",
>        "value": 641.23,
>        "cashback": 0.025,
>    }
>]
>```

1. Adicionar uma nova função no arquivo **src/models/transaction.model.js** que realize a busca por todas as transações;
2. Adicionar uma nova função no arquivo **src/services/transaction.service.js** que define o serviço listagem de transações;
3. Adicionar uma nova função no arquivo **src/controller/transaction.controller.js** que define o controlador da requisição;
4. Adicionar uma nova rota `GET /transactions` no arquivo **src/routes/transaction.route.js** com o _middleware_ de autenticação;

#### 1 - Adicionar uma nova função no arquivo src/models/transaction.model.js que realize a busca por todas as transações

Vamos adicionar o seguinte trecho de código no arquivo **src/models/transaction.model.js**:

```js
const findAll = async ({ accountId, status = true }) => {
  const [rows] = await connection.execute(
    `SELECT 
      transactionId, accountId, cashback, value, date
    FROM transactions AS t 
      JOIN accounts AS a ON a.id = t.accountId 
    WHERE accountId = ? and status = ?;`,
    [accountId, status],
  );

  return rows;
};

//module.exports = { 
  // create, 
  // setCashback,
  findAll };
```

#### 2 - Adicionar uma nova função no arquivo src/services/transaction.service.js que define o serviço listagem de transações

Agora vamos adicionar o seguinte trecho de código no arquivo **src/services/transaction.service.js**:

```js
// ...
// ...
// ...

const findAll = async ({ accountId, status = true }) => {
  return await transactionModel.findAll({ accountId, status });
};

//module.exports = { 
  // create, 
  // setCashback, 
  findAll };
```

#### 3 - Adicionar uma nova função no arquivo src/controllers/transaction.controller.js que define o controlador da requisição

Neste ponto, vamos adicionar o seguinte trecho de código no arquivo **arc/controllers/transaction.controller.js**:

```js
const findAll = async (req, res) => {
  const { accountId, status = true } = req.account;
  const transactions = await service.findAll({ accountId, status });
  res.status(200).json(transactions);
};

// module.exports = { 
  // create,
  // setCashback,
  findAll };
```

#### 4 - Adicionar uma nova rota GET /transactions no arquivo src/routes/transaction.route.js com o middleware de autenticação

Por fim, vamos adicionar a rota da requisição adicionando o seguinte trecho de código no arquivo **src/routes/transaction.route.js**:

```js
// const express = require('express');

// const authMiddleware = require('../middlewares/auth.middleware');
// const transactionController = require('../controllers/transaction.controller');

// const transactionRouter = express.Router();

// transactionRouter.post('/', authMiddleware, transactionController.create);
// transactionRouter.put('/cashback', authMiddleware, transactionController.setCashback);
transactionRouter.get('/', authMiddleware, transactionController.findAll);

// module.exports = transactionRouter;
```
