import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import DocumentInput from '../components/DocumentInput';
import Form from '../components/Form';
import Input from '../components/Input';
import Title from '../components/Title';
import { INVALID_CNPJ, INVALID_CPF, INVALID_PASSWORD } from '../contants';
import { Context } from '../context/MyContext';
import { isCnpjValid, isCPFValid, MAX_CPF_LENTH } from '../helpers/identifierRules';
import { showMessage } from '../helpers/showMessage';
import { isValidPassword } from '../helpers/validators';
import { login } from '../services/api';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useContext(Context);

  const handleLogin = async () => {
    if (identifier.length > MAX_CPF_LENTH) {
      if (!isCnpjValid(identifier)) {
        showMessage(INVALID_CNPJ);
        return;
      }
    } else if (!isCPFValid(identifier)) {
      showMessage(INVALID_CPF);
      return;
    }

    if (!isValidPassword(password)) {
      showMessage(INVALID_PASSWORD);

      return;
    }

    try {
      const response = await login(identifier, password);
      setToken(response.token);
      navigate('/account');
    } catch (error) {
      showMessage(error.message);
    }
  };

  return (
    <section>
      <Form onSubmit={ handleLogin }>
        <Title title="Login" />
        <p>
          Ainda não possui cadastro?
          {' '}
          <Link to="/">Registre aqui</Link>
        </p>

        <DocumentInput identifier={ identifier } setIdentifier={ setIdentifier } />
        <Input
          label="Senha"
          type="password"
          placeholder="Password"
          error={ !!password && !isValidPassword(password) }
          errorMessage={ INVALID_PASSWORD }
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
        />
        <Button type="submit">Entrar</Button>
      </Form>
      <Link to="/">Esqueceu sua senha?</Link>
    </section>
  );
}

export default Login;
