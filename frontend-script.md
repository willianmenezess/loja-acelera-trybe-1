O primeiro passo é criar o nosso projeto, para isso, dentro do diretório do projeto **acelera-trybe-psel/frontend** vamos utilizar o vite com o template de react. Para isso, vamos utilizar o comando:

```bash
npx create-vite@latest
```

Entre na pasta criada e agora vamos instalar as dependências do projeto:

```bash
npm install
```

Como nossa aplicação possuirá rotas, vamos instalar o react-router-dom:

```bash
npm install react-router-dom
```

Com isso, já podemos iniciar o projeto:

```bash
npm run dev
```

# Criando a primeira rota `CreateAccount`

Agora vamos criar a estrutura do nosso projeto, para isso, dentro da pasta src, vamos criar uma pasta chamada pages, dentro dela vamos criar nossas páginas, começando pela página de cadastro. Vamos criar um componente chamado `CreateAccount.jsx` que deverá renderizar o formulário de cadastro com todos os campos necessários para o cadastro de uma conta na API:

- Os campos CPF ou CNPJ, name, email, password e status da conta;
- Sendo o status da conta um valor binário que represente ativo ou inativo.
- O CPF ou CNPJ devem ser valores válidos, isto é, os dígitos verificadores devem validar o documento.

Também iremos adicionar validações para os demais campos, sendo que o campo de email deve ser um email válido e o campo de senha deve ter no mínimo 6 caracteres.

E por fim, vamos adicionar a página de cadastro na rota `/`:

```jsx
// src/pages/CreateAccount.jsx
import { useState } from 'react';

export default function CreateAccount() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(true);

  return (
    <form>
      <label htmlFor="name">
        Nome
        <input
          value={ name }
          onChange={ (e) => setName(e.target.value) }
          id="name"
        />
      </label>
      <label htmlFor="identifier">
        CPF/CNPJ
        <input
          value={ identifier }
          onChange={ (e) => setIdentifier(e.target.value) }
          id="identifier"
        />
      </label>
      <label htmlFor="email">
        Email
        <input
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
          id="email"
        />
      </label>
      <label htmlFor="password">
        Senha
        <input
          type="password"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
          id="password"
        />
      </label>
      <label htmlFor="confirmPassword">
        Confirma Senha
        <input
          type="password"
          value={ confirmPassword }
          onChange={ (e) => setConfirmPassword(e.target.value) }
          id="confirmPassword"
        />
      </label>
      <label htmlFor="status">
        Status da Conta
        <select value={ status } onChange={ (e) => setStatus(e.target.value) }>
          <option value>Ativada</option>
          <option value={ false }>Desativada</option>
        </select>
      </label>
    </form>
  );
}
```

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={ <CreateAccount /> } />
    </Routes>
  );
}
```

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

```

Vamos aproveitar para componentizar os inputs do formulário, para isso, vamos criar uma pasta chamada components dentro da pasta src e criar um componente chamado `FormField.js`. Lembre-se de instalar a dependência prop-types com o `npm i prop-types`.

```jsx
// src/components/FormField.jsx
import PropTypes from 'prop-types';

export default function FormField({
  label, type = 'text', value, onChange, id, options = null, ...props
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <label htmlFor={ id }>
      { label }
      {options ? (
        <select value={ value } onChange={ handleChange } id={ id } { ...props }>
          {options.map((option) => (
            <option value={ option.value } key={ option.label }>
              { option.label }
            </option>
          ))}
        </select>
      ) : (
        <input
          type={ type }
          value={ value }
          onChange={ handleChange }
          id={ id }
          { ...props }
        />
      )}
    </label>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    label: PropTypes.string.isRequired,
  })),
};
```

E agora vamos utilizar o componente `FormField` no nosso componente `CreateAccount`:

```jsx
// src/pages/CreateAccount.jsx

import { useState } from 'react';
import FormField from '../components/FormField';

const STATUS_ACCOUNT_OPTIONS = [
  { value: true, label: 'Ativada' },
  { value: false, label: 'Desativada' },
];

export default function CreateAccount() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(true);

  return (
    <form>
      <FormField
        label="Nome"
        value={ name }
        onChange={ setName }
        id="name"
      />
      <FormField
        label="CPF/CNPJ"
        value={ identifier }
        onChange={ setIdentifier }
        id="identifier"
      />
      <FormField
        label="Email"
        value={ email }
        onChange={ setEmail }
        id="email"
      />
      <FormField
        label="Senha"
        type="password"
        value={ password }
        onChange={ setPassword }
        id="password"
      />
      <FormField
        label="Confirma Senha"
        type="password"
        value={ confirmPassword }
        onChange={ setConfirmPassword }
        id="confirmPassword"
      />
      <FormField
        label="Status da Conta"
        value={ status }
        onChange={ setStatus }
        id="status"
        options={ STATUS_ACCOUNT_OPTIONS }
      />
    </form>
  );
}
```

Vamos adicionar as validações, para isso vamos criar uma pasta denominada `helpers` e dentro dela vamos criar um arquivo chamado `validators.js`, onde vamos colocar todas as funções de validação que iremos utilizar no projeto, cada função irá validar o valor de um campo e retornar uma mensagem de erro caso o valor seja inválido:

```js
// src/helpers/validators.js

export function isValidEmail(email) {
  const isEmailValid = email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

  if (!isEmailValid) return 'Email inválido';
  return '';
}

const PWD_MIN_LENGTH = 6;
export function isValidPassword(pwd) {
  return pwd.length >= PWD_MIN_LENGTH ? '' : 'Senha deve ter no mínimo 6 caracteres';
}

export function isValidConfirmPassword(pwd, pwdConfirm) {
  return pwd === pwdConfirm ? '' : 'Senhas não conferem';
}

const NAME_MIN_LENGTH = 6;
export function isValidName(name) {
  return name.length >= NAME_MIN_LENGTH ? '' : 'Nome deve ter no mínimo 6 caracteres';
}

const CPF_LENGTH = 11;
const CNPJ_LENGTH = 14;
export function isValidCPForCNPJ(cpf = '') {
  if (cpf.length === CPF_LENGTH) {
    const isCPFValid = cpf.match(/(\d){3}\.(\d){3}\.(\d){3}-(\d){2}/);
    if (!isCPFValid) return 'CPF inválido';
    return '';
  }

  if (cpf.length === CNPJ_LENGTH) {
    const isCNPJValid = cpf.match(/(\d){2}\.(\d){3}\.(\d){3}\/(\d){3}[1|2]-(\d){2}/);
    if (!isCNPJValid) return 'CNPJ inválido';
    return '';
  }

  return 'CPF/CNPJ inválido';
}
```

Agora vamos utilizar as funções de validação no nosso componente `CreateAccount` passando a função de validação como prop para o componente `FormField`:

```jsx
// src/pages/CreateAccount.jsx

// ...
     <FormField
        label="Nome"
        value={ name }
        onChange={ setName }
        id="name"
        validator={ isValidName }
      />
// ...
```

E assim para todos demais campos que precisam de validação, com exceção do campo `confirmPassword`, pois ele depende do valor do campo `password`, então vamos criar uma função para validar o campo `confirmPassword`:

```jsx
// src/pages/CreateAccount.jsx

// ...
     <FormField
        label="Confirma Senha"
        type="password"
        value={ confirmPassword }
        onChange={ setConfirmPassword }
        id="confirmPassword"
        validator={ (value) => isValidConfirmPassword(password, value) }
      />
// ...
```

O resultado final vai ficar assim:

```jsx
// src/pages/CreateAccount.jsx

import { useState } from 'react';
import FormField from '../components/FormField';
import { isValidCPForCNPJ, isValidConfirmPassword, isValidEmail, isValidName, isValidPassword } from '../helpers/validators';

const STATUS_ACCOUNT_OPTIONS = [
  { value: true, label: 'Ativada' },
  { value: false, label: 'Desativada' },
];

export default function CreateAccount() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(true);

  return (
    <form>
      <FormField
        label="Nome"
        value={ name }
        onChange={ setName }
        id="name"
        validator={ isValidName }
      />
      <FormField
        label="CPF/CNPJ"
        value={ identifier }
        onChange={ setIdentifier }
        id="identifier"
        validator={ isValidCPForCNPJ }
      />
      <FormField
        label="Email"
        value={ email }
        onChange={ setEmail }
        id="email"
        validator={ isValidEmail }
      />
      <FormField
        label="Senha"
        type="password"
        value={ password }
        onChange={ setPassword }
        id="password"
        validator={ isValidPassword }
      />
      <FormField
        label="Confirma Senha"
        type="password"
        value={ confirmPassword }
        onChange={ setConfirmPassword }
        id="confirmPassword"    
        validator={ (value) => isValidConfirmPassword(password, value) }
      />
      <FormField
        label="Status da Conta"
        value={ status }
        onChange={ setStatus }
        id="status"
        options={ STATUS_ACCOUNT_OPTIONS }
        validator={ isValidName }
      />
    </form>
  );
}
```

Agora vamos utilizar a prop `validator` no componente `FormField` para validar o valor do campo, para isso podemos utilizar o `useState` para armazenar o valor do erro:

```jsx
// src/components/FormField.jsx

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  id,
  options = null,
  validator = null,
  ...props
}) {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    onChange(e.target.value);
    if (validator) {
      setError(validator(e.target.value));
    }
  };

  return (
    <label htmlFor={ id }>
      { label }
      {options ? (
        <select value={ value } onChange={ handleChange } id={ id } { ...props }>
          {options.map((option) => (
            <option value={ option.value } key={ option.label }>
              { option.label }
            </option>
          ))}
        </select>
      ) : (
        <input
          type={ type }
          value={ value }
          onChange={ handleChange }
          id={ id }
          { ...props }
        />
      )}
      { error && <span>{ error }</span> }
    </label>
  );
}

FormField.propTypes = {
  // ...
  validator: PropTypes.func,
};
```

Isso já irá funcionar, porém vamos adicionar um recurso do html chamado `setCustomValidity` para que o formulário não seja enviado caso algum campo esteja inválido e o campo será destacado com uma borda vermelha:

```jsx
// ...
  const handleChange = (e) => {
    onChange(e.target.value);

    if (validator) {
      const fieldValidation = validator(e.target.value);
      setError(fieldValidation);
      e.target.setCustomValidity(fieldValidation);
    }
  };
// ...
```

O resultado final ficará assim:

```jsx
// src/components/FormField.jsx
import { useState } from 'react'
import PropTypes from 'prop-types';

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  id,
  options = null,
  validator = null,
  ...props
}) {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    onChange(e.target.value);

    if (validator) {
      const fieldValidation = validator(e.target.value);
      setError(fieldValidation);
      e.target.setCustomValidity(fieldValidation);
    }
  };

  return (
    <label htmlFor={ id }>
      { label }
      {options ? (
        <select value={ value } onChange={ handleChange } id={ id } { ...props }>
          {options.map((option) => (
            <option value={ option.value } key={ option.label }>
              { option.label }
            </option>
          ))}
        </select>
      ) : (
        <input
          type={ type }
          value={ value }
          onChange={ handleChange }
          id={ id }
          { ...props }
        />
      )}
      { error && <span>{ error }</span> }
    </label>
  );
}

FormField.propTypes = {
  // ...
  validator: PropTypes.func,
};
```

Vamos agora criar a lógica para submeter o formulário, mas antes vamos criar um arquivo chamado `api.js` para armazenar as funções que irão fazer as requisições para a API:

```js
// src/services/api.js

const URL = 'http://localhost:3001'; // URL da API backend

async function fetchAPI(endpoint, options) {
  const response = await fetch(`${URL}/${endpoint}`, options);
  const data = await response.json();

  if (response.ok) {
    return data;
  }
  throw new Error(data.message);
}

export async function createAccount(newAccount) {
  return fetchAPI('accounts', {
    method: 'POST',
    body: JSON.stringify(newAccount),
  });
}
```

Agora vamos criar a função que irá submeter o formulário e redirecionar para a página de login:

```jsx
// src/pages/CreateAccount.jsx

function CreateAccount() {
  // ...
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAccount({
      name,
      identifier,
      email,
      password,
      status,
    });

    navigate('/login');
  };

  return (
    <form onSubmit={ handleSubmit }>
      // ...
```

Agora vamos apenas utilizar a biblioteca `react-toastify` para exibir uma mensagem de sucesso e/ou erro ao criar a conta:

```bash
npm install react-toastify
```

```jsx
// src/helpers/showMessage.js

import { toast } from 'react-toastify';

export function showMessage(message, type = 'success') {
  toast[type](message, {
    position: 'top-center',
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    autoClose: 5000,
  });
}

export function showErrorMessage(error) {
  showMessage(error.message, 'error');
  console.error(error);
}
```

```jsx
// src/pages/CreateAccount.jsx
import { showErrorMessage, showMessage } from '../helpers/showMessage';

function CreateAccount() {
  // ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccount({
        name,
        identifier,
        email,
        password,
        status,
      });

      showMessage('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <form onSubmit={ handleSubmit }>
      // ...
```

Agora só precisamos importar o css da lib no arquivo `main.jsx`:

```jsx
// src/main.jsx
// ...
import 'react-toastify/dist/ReactToastify.css';
// ...
```

Para finalizar vamos adicionar um link para a página de login na página de criação de conta:

```jsx
// src/pages/CreateAccount.jsx

function CreateAccount() {
  // ...
  return (
    <form onSubmit={ handleSubmit }>
      // ...
      <Link to="/login">Já tenho uma conta</Link>
    </form>
  );
}
```

# Criando a página de login

Agora vamos criar a página de login, para isso vamos criar um arquivo chamado `Login.jsx` dentro da pasta `pages` que irá possuir:

- Um título `Login`;
- Os campos `CPF/CNPJ` e `Senha`;
- Botão `Entrar`;
- Link para a página de criação de conta.

```jsx
// src/pages/Login.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../components/FormField';
import { isValidCPForCNPJ, isValidPassword } from '../helpers/validators';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <section>
      <h1>Login</h1>
      <form>
        <FormField
          label="CPF/CNPJ"
          value={ identifier }
          onChange={ setIdentifier }
          id="identifier"
          validator={ isValidCPForCNPJ }
        />
        <FormField
          label="Senha"
          type="password"
          value={ password }
          onChange={ setPassword }
          id="password"
          validator={ isValidPassword }
        />
        <button type="submit">Entrar</button>
        <Link to="/">Registre aqui</Link>
      </form>
    </section>
  );
}
```

Agora vamos criar a função que irá submeter o formulário e redirecionar para a página de extrato e criar a função login no arquivo `api.js`:

```js
// src/services/api.js
// ...
export async function login(identifier, password) {
  return fetchAPI('login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}
```

```jsx
// src/pages/Login.jsx
import { login } from '../services/api';
import { showErrorMessage, showMessage } from '../helpers/showMessage';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  // ...
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(identifier, password);
      console.log(token);

      showMessage('Login realizado com sucesso!');
      navigate('/account');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={ handleSubmit }>
        // ...
```

A API irá retornar um token que será utilizado para fazer as requisições para a API backend, então vamos armazenar esse token no `context`, para isso vamos precisar configurar o `context`:

```jsx
// src/context/ContextProvider.jsx

import { createContext, useState } from 'react';
import { PropTypes } from 'prop-types';

export const Context = createContext();

export default function ContextProvider({ children }) {
  const [token, setToken] = useState('');

  const value = useMemo(() => ({
    token,
    setToken,
  }), [token]);

  return (
    <Context.Provider value={ value }>
      { children }
    </Context.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

```

```jsx
// src/main.jsx
// ...
import ContextProvider from './context/ContextProvider';
// ...

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ContextProvider>
      <App />
    </ContextProvider>
  </BrowserRouter>,
);
```

```jsx
// src/pages/Login.jsx
import { useContext, useState } from 'react';
// ...
import { Context } from '../context/ContextProvider';

function Login() {
  // ...
  const { setToken } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(identifier, password);
      setToken(token);

      // ...
    } catch (error) {
      // ...
    }
  };

```

Vamos aproveitar para salvar o token no `localStorage` para que o usuário não precise fazer login toda vez que acessar a aplicação:

```jsx
// src/context/ContextProvider.jsx
import { createContext, useEffect, useMemo, useState } from 'react';

export default function ContextProvider({ children }) {
  // ...
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  // ...
```

Agora basta adicionar a página de login no arquivo `App.jsx`:

```jsx
// src/App.jsx
// ...
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={ <CreateAccount /> } />
      <Route path="/login" element={ <Login /> } />
    </Routes>
  );
}
```

# Criando a página de extrato

Agora vamos criar a página de extrato, para isso vamos criar um arquivo chamado `BankStatement.jsx` dentro da pasta `pages` que irá possuir:

- Um título `Extrato`;
- Um botão `Sair` que irá redirecionar para a página de login e limpar o token do `context`;
- Um total de cashback.
- Uma lista com as transações do usuário.

O primeiro passo é criar a função que irá buscar as transações do usuário:

```js
// src/services/api.js

export async function getTransactions(token) {
  return fetchAPI('transactions', {
    headers: {
      Authorization: token,
    },
  });
}
```

```jsx
// src/pages/BankStatement.jsx

import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/ContextProvider';
import { getTransactions } from '../services/api';
import { showErrorMessage } from '../helpers/showMessage';

export default function BankStatement() {
  const { token } = useContext(Context);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions(token)
      .then((transactionsData) => setTransactions(transactionsData))
      .catch(showErrorMessage);
  }, [token]);
}
```

Agora com os dados das transações vamos exibir os dados na tela:

```jsx
// src/pages/BankStatement.jsx
import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/ContextProvider';
import { getTransactions } from '../services/api';
import { showErrorMessage } from '../helpers/showMessage';
import { formatCurrency, formatDate } from '../helpers/formatters';

export default function BankStatement() {
  const { token } = useContext(Context);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions(token)
      .then((transactionsData) => setTransactions(transactionsData))
      .catch(showErrorMessage);
  }, [token]);

  const totalCashback = formatCurrency(
    transactions.reduce((total, t) => total + t.cashback, 0),
  );

  return (
    <section>
      <header>
        <h1>Extrato</h1>
        <h2>Total de cashback</h2>
        <span>{totalCashback}</span>
      </header>
      <section>
        <ul>
          {transactions.map((transaction) => (
            <li key={ transaction.date }>
              <div>
                <span>Compra</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
              <div>
                <span>{formatCurrency(transaction.value)}</span>
                <span>{formatCurrency(transaction.cashback || 0)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
```

```js
// src/helpers/formatters.js

export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      hour12: true,
    },
  );
}
```

Agora basta adicionar o componente `BankStatement` na rota `/account`:

```jsx
// src/App.jsx

// ...
import BankStatement from './pages/BankStatement';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={ <CreateAccount /> } />
      <Route path="/login" element={ <Login /> } />
      <Route path="/account" element={ <BankStatement /> } />
    </Routes>
  );
}
```

# Criando a página de edição de conta

Agora vamos criar a página de edição de conta, para isso vamos criar um arquivo chamado `EditAccount.jsx` dentro da pasta `pages` que irá possuir:

- Um título `Editar conta`;
- Um formulário com os campos `Nome`, `CPF`, `E-mail`, `Senha` e `Confirmar senha`;
- Um botão `Salvar` que irá enviar os dados para a API e atualizar os dados do usuário.
- Um botão `Excluir a conta` que irá enviar uma requisição para a API e excluir a conta do usuário.

Perceba que o formulário de edição de conta é muito parecido com o formulário de criação de conta, então vamos aproveitar e refatorar nosso código, criando um componente `Form` que irá receber os dados do usuário e poderá ser utilizado tanto na página de criação de conta quanto na página de edição de conta.

```jsx
// src/components/Form.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';
import {
  isValidConfirmPassword, isValidCPForCNPJ, isValidEmail, isValidName, isValidPassword,
} from '../helpers/validators';

export const STATUS_ACCOUNT_OPTIONS = [
  { value: true, label: 'Ativada' },
  { value: false, label: 'Desativada' },
];

const INITIAL_STATE = {
  name: '',
  identifier: '',
  email: '',
  password: '',
  confirmPassword: '',
  status: STATUS_ACCOUNT_OPTIONS[0].value,
};

export default function Form({
  children = null,
  onSubmit,
  formInitialState = {},
  submitBtnText = 'Enviar',
}) {
  const [form, setForm] = useState({ ...INITIAL_STATE, ...formInitialState });
  const {
    name,
    identifier,
    email,
    password,
    confirmPassword,
    status,
  } = form;

  const handleChange = (value, target) => {
    const { id } = target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={ handleSubmit }>
      <FormField
        label="Nome"
        value={ name }
        onChange={ handleChange }
        id="name"
        validator={ isValidName }
      />
      <FormField
        label="CPF/CNPJ"
        value={ identifier }
        onChange={ handleChange }
        id="identifier"
        validator={ isValidCPForCNPJ }
      />
      <FormField
        label="Email"
        value={ email }
        onChange={ handleChange }
        id="email"
        validator={ isValidEmail }
      />
      <FormField
        label="Senha"
        type="password"
        value={ password }
        onChange={ handleChange }
        id="password"
        validator={ isValidPassword }
      />
      <FormField
        label="Confirma Senha"
        type="password"
        value={ confirmPassword }
        onChange={ handleChange }
        id="confirmPassword"
        validator={ (value) => isValidConfirmPassword(value, password) }
      />
      <FormField
        label="Status da Conta"
        value={ status }
        onChange={ handleChange }
        id="status"
        options={ STATUS_ACCOUNT_OPTIONS }
      />
      <button type="submit">{submitBtnText}</button>
      {children}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  formInitialState: PropTypes.shape({
    name: PropTypes.string,
    identifier: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    status: PropTypes.string,
  }),
  submitBtnText: PropTypes.string,
};
```

Modificando o componente `FormField`:

```jsx
// src/components/FormField.jsx
// ...

export default FormField({/* ... */}) {
  // ...
  const handleChange = (e) => {
    onChange(e.target.value, e.target);
    // ...
}
```

Refatorando o componente `CreateAccount`:

```jsx
import { Link, useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { createAccount } from '../services/api';

function CreateAccount() {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    const { name, identifier, email, password, status } = form;

    try {
      await createAccount({
        name,
        identifier,
        email,
        password,
        status,
      });

      showMessage('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <section>
      <h1>Criar sua Conta</h1>
      <Form
        onSubmit={ handleSubmit }
        submitBtnText="Criar Conta"
      >
        <Link to="/login">Já tenho uma conta</Link>
      </Form>
    </section>
  );
}

export default CreateAccount;
```

Criando o componente `EditAccount`:

```jsx
// src/pages/EditAccount.jsx
import Form from '../components/Form';

export default function EditAccount() {
  return (
    <section>
      <h1>Editar sua Conta</h1>
      <Form
        onSubmit={ handleSubmit }
        submitBtnText="Salvar"
        formInitialState={{}} // ??
      />
    </section>
  );
}
```

Note que agora precisamos passar os dados do usuário para o componente `Form` para que ele possa ser exibido no formulário, para isso vamos fazer com que o ContextProvider realize a requisição para a API e retorne os dados do usuário, para isso vamos adicionar um novo estado `user` no ContextProvider e aproveitar para trazer para o ContextProvider o estado transactions que está sendo mantido no componente `BankStatement`:

```jsx
// src/context/ContextProvider.jsx
import { createContext, useEffect, useMemo, useState } from 'react';
import { PropTypes } from 'prop-types';
import { getAccount, getTransactions } from '../services/api';

export const Context = createContext();

export default function ContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [account, setAccount] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('token', token);

    async function fetchAccount() {
      try {
        setIsLoading(true);
        const accountData = await getAccount(token);
        const transactionsData = await getTransactions(token);

        setTransactions(transactionsData);
        setAccount(accountData);
        setIsLoading(false);
      } catch (error) {
        showErrorMessage(error);
      }
    }

    if (token) {
      fetchAccount();
    }
  }, [token]);

  const value = useMemo(() => ({
    token,
    setToken,
    account,
    setAccount,
    transactions,
    isLoading,
  }), [token, account, transactions, isLoading]);

  return (
    <Context.Provider value={ value }>
      { children }
    </Context.Provider>
  );
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
```

```jsx
// src/pages/BankStatement.jsx
import { useContext } from 'react';
import { Context } from '../context/ContextProvider';
import { formatCurrency, formatDate } from '../helpers/formatters';

export default function BankStatement() {
  const { transactions } = useContext(Context);

  const totalCashback = formatCurrency(
    transactions.reduce((total, t) => total + t.cashback, 0),
  );

  return (
    <section>
      <header>
        <h1>Extrato</h1>
        <h2>Total de cashback</h2>
        <span>{totalCashback}</span>
      </header>
      <section>
        <ul>
          {transactions.map((transaction) => (
            <li key={ transaction.date }>
              <div>
                <span>Compra</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
              <div>
                <span>{formatCurrency(transaction.value)}</span>
                <span>{formatCurrency(transaction.cashback || 0)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
```

Agora vamos fazer com que o componente `EditAccount` receba os dados do usuário para que possa ser exibido no formulário e também para que possamos enviar os dados atualizados para a API:

```jsx
// src/pages/EditAccount.jsx

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Form from '../components/Form';
import { Context } from '../context/ContextProvider';
import { showMessage, showErrorMessage } from '../helpers/showMessage';
import { editAccount } from '../services/api';

export default function EditAccount() {
  const { account, setAccount, token } = useContext(Context);

  const handleSubmit = async (editedAccount) => {
    const newAccount = Object.keys(editedAccount).reduce((acc, key) => {
      // reduce para criar um novo objeto apenas com as chaves que foram alteradas
      if (editedAccount[key] !== account[key]) {
        return {
          ...acc,
          [key]: editedAccount[key],
        };
      }
      return acc;
    }, {});

    if (editedAccount.password === '') {
      delete newAccount.password;
    }

    try {
      const responseAccount = await editAccount(
        newAccount,
        token,
      );
      setAccount({ ...account, ...responseAccount });
      showMessage('Conta editada com sucesso!');
    } catch (error) {
      showErrorMessage(error.message);
    }
  };

  if (!account.identifier) return <Navigate to="/login" replace />;
  // se o usuário não estiver logado, redireciona para a página de login

  return (
    <section>
      <h1>Editar sua Conta</h1>
      <Form
        onSubmit={ handleSubmit }
        submitBtnText="Salvar"
        formInitialState={ account }
      />
    </section>
  );
}
```

```js
// src/services/api.js
export async function editAccount(editedAccount, token) {
  return fetchAPI('accounts', {
    method: 'PUT',
    body: JSON.stringify(editedAccount),
    headers: {
      Authorization: token,
    },
  });
}
```

Vamos também

- adicionar o botão de deletar conta na página `EditAccount`
- fazer com que ele envie uma requisição para a API para deletar a conta do usuário
- Realizar o logout do usuário deletando os dados do context e redirecioná-lo para a página de login

```js
// src/services/api.js
export async function deleteAccount(token) {
  return fetchAPI('accounts', {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });
}
```

```jsx
// src/pages/EditAccount.jsx
// ...
import { deleteAccount } from '../services/api';

function EditAccount() {
  // ...
  const navigate = useNavigate();
  // ...

  const handleDeleteAccount = async () => {
    const confirm = window.confirm('Tem certeza que deseja deletar sua conta?');
    try {
      if (confirm) {
        await deleteAccount(token);
        setAccount({});
        setToken('');
        showMessage('Conta deletada com sucesso!');
        navigate('/login');
      }
    } catch (error) {
      showErrorMessage(error.message);
    }
  };

  return (
    <section>
      <h1>Editar sua Conta</h1>
      <Form
        onSubmit={ handleSubmit }
        submitBtnText="Salvar"
        formInitialState={ account }
      >
        <button
          type="button"
          onClick={ handleDeleteAccount }
        >
          Deletar Conta
        </button>
      </Form>
    </section>
  );
}
```

Agora basta adicionar a rota para a página `EditAccount` no arquivo `src/routes.jsx`:

```jsx
// src/App.jsx
// ...
import EditAccount from './pages/EditAccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <CreateAccount /> } />
      <Route path="/login" element={ <Login /> } />
      <Route path="/account" element={ <BankStatement /> } />
      <Route path="/account/edit" element={ <EditAccount /> } />
    </Routes>
  );
}
```

Com isso já temos a aplicação completa! Agora vamos apenas dar uma melhorada na estilização e melhorar a experiência do usuário.

# Estilização

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

:root {
  font-family: 'Playfair Display', serif;
  --main-color: rgba(255, 255, 255, 1);
  --accent: rgba(244, 24, 183, 1);
  background: var(--main-color);
}

html {
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  text-decoration: none;
}

.app__container {
  display: flex;
}

main {
  flex: 1;
  height: 100vh;
}

main > section {
  position: relative;
  padding: 1rem 3rem;
}

h1 {
  font-size: 2rem;
}

button {
  border: none;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.3rem;
}
```

```css
/* src/reset.css */
html {
  box-sizing: border-box;
  font-size: 16px;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol, ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}
```

```jsx
// src/main.jsx
// ...
import './reset.css';
import './index.css';
// ...
```

```css
/* src/components/Form.css */
.form-container {
  display: flex;
  flex-direction: column;
}

.form-container button {
  width: 100%;
  color: white;
  background: linear-gradient(
      271.15deg,
      #79716c 7.64%,
      rgba(247, 8, 166, 0.62) 88.95%
    ),
    #207198;
}

.form-container a {
  color: var(--accent);
}
```

```jsx
// src/components/Form.jsx
// ...
import './Form.css';

function Form({ onSubmit, submitBtnText, formInitialState, children }) {
  // ...
  return (
    <form
      className="form-container"
      onSubmit={ handleSubmit }
    >
      { children }
      <button type="submit">
        { submitBtnText }
      </button>
    </form>
  );
}
```

```jsx
// src/pages/Login.jsx
// ...

export default Login() {
  // ...
  return (
    // ...
    <form onSubmit={ handleSubmit } className="form-container">
    // ...
  )
}
```

```css
/* src/FormField.css */
.label {
  flex: 1;
  margin-bottom: 2rem;
  width: 100%;
}

.label p {
  margin-bottom: 0.3rem;
  margin-left: 0.5rem;
  font-size: 0.6rem;
}

.label span {
  color: var(--accent);
  font-size: 0.8rem;
  float: right;
}

.label input, .label select {
  width: 100%;
  border-radius: 0.4rem;
  padding: 1rem;
  font-weight: 400;
}
```

```jsx
// src/FormField.jsx
// ...
import './FormField.css';

export default function FormField({/* ... */}) {
  // ...
  return (
    <label htmlFor={ id } className="label">
    //...
```

```css
/* src/pages/BankStatement.css */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 1.5rem;
  border-bottom-right-radius: 2rem;
  border-bottom-left-radius: 2rem;
  background: linear-gradient(169.52deg, rgba(35, 33, 33, 0.85) -3.32%, rgba(244, 10, 94, 0.85) 122.16%);
}

.header h1 {
  margin-bottom: 3rem;
}

.header h2 {
  font-size: 1.4rem;
  font-weight: 300;
}

.header span {
  font-size: 2rem;
}

.transactions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 1.5rem;
  border-top-right-radius: 2rem;
  border-top-left-radius: 2rem;
  background: linear-gradient(169.98deg, rgba(35, 33, 33, 0.85) -11.91%, rgba(244, 10, 94, 0.85) 96.13%, rgba(244, 10, 94, 0.85) 106.61%);
}

.transactions ul {
  width: 100%;
}

.transaction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.transaction__item, .transaction__value {
  display: flex;
  flex-direction: column;
}

.transaction__item span:first-child {
  font-size: 1.5rem;
}

.transaction__item span:last-child {
  font-size: 0.8rem;
}

.transaction__value {
  align-items: end;
}

.transaction__value span:first-child {
  font-size: 1.3rem;
}

.transaction__value span:last-child {
  font-size: 1rem;
  color: rgba(69, 244, 108, 1);
}
```

```jsx
// src/pages/BankStatement.jsx
// ...
import './BankStatement.css';

function BankStatement() {
  // ...
  return (
    <section className="bank__statement">
      <header className="header">
        <h1>Extrato</h1>
        <h2>Total de cashback</h2>
        <span>{totalCashback}</span>
      </header>
      <section className="transactions">
        <ul>
          {transactions.map((transaction) => (
            <li key={ transaction.date } className="transaction">
              <div className="transaction__item">
                <span>Compra</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
              <div className="transaction__value">
                <span>{formatCurrency(transaction.value)}</span>
                <span>{formatCurrency(transaction.cashback || 0)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
```

# Adicionando novos elementos para melhorar a usabilidade e permitir a navegação entre as páginas

```css
/* src/index.css */
/* ... */

.banner {
  flex: 1;
  background-size: cover;
  background-position: center;
  background-image: url(../assets/MoneyPot.svg);
}

@media (max-width: 750px) {
  .banner {
    display: none;
  }
}
```

```jsx
// src/App.jsx
import { ToastContainer } from 'react-toastify';
import Routes from './pages/Routes';

export default function App() {
  return (
    <>
      <ToastContainer />
      <section className="app__container">
        <div className="banner" />
        <main>
          <Routes />
        </main>
      </section>
    </>
  );
}
```

```jsx
import { Routes as RoutesReact, Route } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import Login from './Login';
import BankStatement from './BankStatement';
import EditAccount from './EditAccount';
import Menu from './Menu';

export default function Routes() {
  return (
    <RoutesReact>
      <Route path="/" element={ <CreateAccount /> } />
      <Route path="/login" element={ <Login /> } />
      <Route path="account" element={ <Menu /> }> // <== Adicionando o componente Menu como rota pai, para que ele seja exibido em todas as páginas filhas
        <Route index element={ <BankStatement /> } />
        <Route path="edit" element={ <EditAccount /> } />
      </Route>
    </RoutesReact>
  );
}
```

```jsx
// src/pages/Menu.jsx
import { useContext, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Drawer from 'react-modern-drawer'; // instalando um novo pacote
// npm install react-modern-drawer
import 'react-modern-drawer/dist/index.css';
import { Context } from '../context/ContextProvider';
import './Menu.css';

function Menu() {
  const { account, setAccount, setToken, isLoading } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setIsOpen((prevState) => !prevState);

  const logOff = () => {
    setAccount({});
    setToken('');
    navigate('/login');
  };

  if (isLoading) return <section>Loading</section>;

  return (
    <section className="drawer">
      <button onClick={ toggleDrawer } type="button">Menu</button>
      <Drawer
        open={ isOpen }
        onClose={ toggleDrawer }
        direction="left"
        className="menu"
      >
        <div className="profile">
          <p>{account.name}</p>
          <span>{account.identifier}</span>
        </div>
        <div className="links">
          <Link to="/account">Extratos</Link>
          <Link to="/account/edit">Editar Perfil</Link>
        </div>
        <button onClick={ logOff } type="button">Sair</button>
      </Drawer>
      <Outlet />
      {/* O Outlet que renderiza o componente que está dentro da Route filha */}
    </section>
  );
}

export default Menu;
```

# Melhorando a validação do CPF/CNPJ

```jsx
// src/helpers/validateIdentifier.js

export const CPF_LENTH = 14;
export const MAX_CPF_LENTH = CPF_LENTH + 3;

const digiteCalculatorCNPJ = (cnpj, options = {}) => {
  const { start = '', end = '' } = options;

  const validatorNumber = '6543298765432';
  const numberBase = (start.toString() + cnpj + end.toString());
  const arrNumberBase = numberBase.split('');
  const NumberBaseTimesConstante = arrNumberBase.reduce(
    (acc, cur, index) => cur * validatorNumber[index] + Number(acc),
    0,
  );
  const restDivision = NumberBaseTimesConstante % 11;
  return (11 - restDivision).toString();
};

// source fo rule http://arcontabilbsj.com/materiasx.php?recordID=157
export const isCnpjValid = (cnpj) => {
  const matchRegex = cnpj.match(/(\d){2}\.(\d){3}\.(\d){3}\/(\d){3}[1|2]-(\d){2}/);
  if (!matchRegex) return false;
  const [base, validator] = cnpj.split('-');
  const baseOnlyNumbers = base.replaceAll('/', '').replaceAll('.', '');

  const firstDigite = digiteCalculatorCNPJ(baseOnlyNumbers, { start: '0' });
  const secondDigite = digiteCalculatorCNPJ(baseOnlyNumbers, { end: firstDigite });
  return (firstDigite + secondDigite) === validator;
};

const digiteCalculatorCPF = (cpf, options = {}) => {
  const { end = '' } = options;
  const newCpfNumber = cpf + end;
  const multipledDigits = newCpfNumber.split('')
    .reduce((acc, cur, index) => acc + (cur * (newCpfNumber.length + 1 - index)), 0);
  const digite = (multipledDigits * 10) % 11;
  if (digite === 10 || digite === 11) {
    return 0;
  }
  return digite.toString();
};

export const isCPFValid = (cpf) => {
  const matchRegex = cpf.match(/(\d){3}\.(\d){3}\.(\d){3}-(\d){2}/);
  if (!matchRegex) return false;

  const [base, validator] = cpf.split('-');
  const baseOnlyNumbers = base.replaceAll('/', '').replaceAll('.', '');

  const firstDigite = digiteCalculatorCPF(baseOnlyNumbers);
  const secondDigite = digiteCalculatorCPF(baseOnlyNumbers, { end: firstDigite });
  return (firstDigite + secondDigite) === validator;
};
```

```js
// src/helpers/validators.js
import { isCPFValid, isCnpjValid } from './validateIdentifier';

// ...
export function isValidCPForCNPJ(identifier = '') {
  if (identifier.length === CPF_LENGTH) {
    if (!isCPFValid(cpf)) return 'CPF inválido';
    return '';
  }

  if (identifier.length === CNPJ_LENGTH) {
    if (!isCnpjValid(identifier)) return 'CNPJ inválido';
    return '';
  }

  return 'CPF/CNPJ inválido';
}
```

# Adicionando testes

```jsx
// src/tests/helpers/renderWithRouter.jsx

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};
```

```jsx
// src/tests/createAccount.test.jsx

import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import { VALID_CPF, VALID_EMAIL, VALID_NAME, VALID_PASSWORD } from './constants';
import { renderWithRouter } from './helpers/renderWithRouter';

describe('Create Account page', () => {
  test('should create an account successfully', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: '1234',
        }),
      });
    const { user } = renderWithRouter(<App />);

    screen.getByRole('heading', { level: 1, name: /Crie sua conta/i });

    const name = screen.getByLabelText(/Nome/);
    const email = screen.getByLabelText(/Email/i);
    const identifier = screen.getByLabelText(/CPF/);
    const password = screen.getByLabelText('Senha');
    const passwordConfirmation = screen.getByLabelText('Confirma Senha');

    await user.type(name, VALID_NAME);
    await user.type(email, VALID_EMAIL);
    await user.type(identifier, VALID_CPF);
    await user.type(password, VALID_PASSWORD);
    await user.type(passwordConfirmation, VALID_PASSWORD);

    const btnConfirm = screen.getByRole('button', { name: /Crie sua conta/i });

    await user.click(btnConfirm);

    screen.getByRole('heading', { level: 1, name: /login/i });
  });
});
```

```jsx
// src/tests/login.test.jsx
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';
import { INVALID_CPF_NUMBERS, INVALID_DOCUMENT, INVALID_PASSWORD, INVALID_PASSWORD_NUMBER, VALID_CNPJ, VALID_CNPJ_NUMBERS, VALID_CPF, VALID_CPF_NUMBERS, VALID_PASSWORD } from './constants';
import { renderWithRouter } from './helpers/renderWithRouter';

describe('Login page', () => {
  test('should login successfully if a valid CPF is inserted', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: '1234',
        }),
      }).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });
    const { user } = renderWithRouter(<App />, { route: '/login' });

    screen.getByRole('heading', { level: 1, name: /login/i });

    const identifier = screen.getByLabelText(/CPF/);
    const password = screen.getByLabelText(/senha/i);

    await user.type(identifier, VALID_CPF_NUMBERS);
    await user.type(password, VALID_PASSWORD);

    expect(identifier.value).toBe(VALID_CPF);
    expect(password.value).toBe(VALID_PASSWORD);

    const submitBtn = screen.getByRole('button', { name: /Entrar/i });

    await user.click(submitBtn);

    await screen.findByRole('heading', { level: 1, name: /Extrato/i });
  });

  test('should login successfully if a valid CNPJ is inserted', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: '1234',
        }),
      }).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });
    const { user } = renderWithRouter(<App />, { route: '/login' });

    screen.getByRole('heading', { level: 1, name: /login/i });

    const identifier = screen.getByLabelText(/CPF/);
    const password = screen.getByLabelText(/senha/i);

    await user.type(identifier, VALID_CNPJ_NUMBERS);
    await user.type(password, VALID_PASSWORD);

    expect(identifier.value).toBe(VALID_CNPJ);
    expect(password.value).toBe(VALID_PASSWORD);

    const submitBtn = screen.getByRole('button', { name: /Entrar/i });

    await user.click(submitBtn);

    await screen.findByRole('heading', { level: 1, name: /Extrato/i });
  });

  test(`should show ${INVALID_DOCUMENT} if the identifier is incorrect`, async () => {
    const { user } = renderWithRouter(<App />, { route: '/login' });

    const identifier = screen.getByLabelText(/CPF/);

    await user.type(identifier, INVALID_CPF_NUMBERS);

    const errorMessage = screen.getByText(INVALID_DOCUMENT);
    expect(errorMessage).toBeInTheDocument();
  });

  test(`should show ${INVALID_PASSWORD} if the password is incorrect`, async () => {
    const { user } = renderWithRouter(<App />, { route: '/login' });

    const password = screen.getByLabelText(/senha/i);

    await user.type(password, INVALID_PASSWORD_NUMBER);

    const errorMessage = screen.getByText(INVALID_PASSWORD);
    expect(errorMessage).toBeInTheDocument();
  });
});
```

```jsx
// src/tests/editAccount.test.jsx

import { screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import App from '../App';
import {
  fakeAccount,
  fakeTransactions,
  VALID_CPF_NUMBERS,
  VALID_EMAIL,
  VALID_NAME,
  VALID_PASSWORD,
} from './constants';
import { renderWithRouter } from './helpers/renderWithRouter';

describe('Edit Account page', () => {
  test('should edit an account successfully', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: vi
        .fn()
        .mockResolvedValueOnce({
          token: '1234',
        })
        .mockRejectedValueOnce(fakeAccount)
        .mockResolvedValue(fakeTransactions),
    });
    const { user } = renderWithRouter(<App />, { route: '/login' });

    // Login
    const identifierLogin = screen.getByLabelText(/CPF/);
    const passwordLogin = screen.getByLabelText(/senha/i);
    await user.type(identifierLogin, VALID_CPF_NUMBERS);
    await user.type(passwordLogin, VALID_PASSWORD);
    const submitBtn = screen.getByRole('button', { name: /Entrar/i });
    await user.click(submitBtn);

    await screen.findByRole('heading', { level: 1, name: /Extrato/i });

    // navigate to edit Account
    const editAccountLink = screen.getByText('Editar Perfil');
    await user.click(editAccountLink);

    const name = screen.getByLabelText(/Nome/);
    const email = screen.getByLabelText(/Email/i);

    expect(name.value).toBe(fakeAccount.name);
    expect(email.value).toBe(fakeAccount.email);

    await user.type(name, VALID_NAME);
    await user.type(email, VALID_EMAIL);

    const btnConfirm = screen.getByRole('button', {
      name: /Editar sua conta/i,
    });
    await user.click(btnConfirm);
  });
});
```

```js
// src/tests/helpers/constants.js

/* eslint-disable max-len */
export const SERVER_ERROR = 'Ocorreu um erro de requisição para o servidor, por favor entre em contato com a pessoa administrador do sistema';
export const INVALID_FIELDS = 'Existem erros em alguns campos';
export const INVALID_PASSWORD = 'Senha inválida';
export const INVALID_PASSWORD_CONFIRMATION = 'Senha diferente';
export const INVALID_DOCUMENT = 'Documento inválido';
export const INVALID_CPF = 'CPF inválido';
export const INVALID_CNPJ = 'CNPJ inválido';
export const INVALID_EMAIL = 'Email inválido';
export const INVALID_NAME = 'Nome inválido';
export const EDITED_ACCOUNT_SUCCESS = 'Conta editada com sucesso!';
export const DELETE_ACCOUNT = 'Deseja excluir sua conta?';
export const DELETE_ACCOUNT_SUCCESS = 'Conta deletada com sucesso!';
export const STATUS_ACCOUNT_OPTIONS = [
  { value: true, label: 'Ativada' },
  { value: false, label: 'Desativada' },
];
export const VALID_CPF = '878.504.990-50';
export const VALID_CPF_NUMBERS = '87850499050';
export const INVALID_CPF_NUMBERS = '878504990';
export const VALID_CNPJ = '39.512.462/0001-23';
export const VALID_CNPJ_NUMBERS = '39512462000123';
export const VALID_PASSWORD = '123123';
export const INVALID_PASSWORD_NUMBER = '12312';
export const VALID_NAME = 'Trybe Company';
export const VALID_EMAIL = 'trybe@trybe.com';
export const fakeAccount = {
  id: 1,
  identifier: VALID_CPF,
  name: 'Teste Trybe',
  email: 'teste@teste.com',
  status: true,
};
export const fakeTransactions = [
  {
    transactionId: 1.2312312334545356e+23,
    documento: '123475789-10',
    accountId: 1,
    date: '2023-03-08T12:48:25.000Z',
    value: 105.39,
    cashback: 0.02,
  },
  {
    transactionId: 8.976098765723987e+23,
    documento: '123475789-10',
    accountId: 1,
    date: '2023-03-09T09:23:58.000Z',
    value: 641.23,
    cashback: 0.025,
  },
];
```
