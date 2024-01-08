import React from 'react';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import Button from './Button';
import Form from './Form';
import Input from './Input';
import SelectInput from './SelectInput';
import Title from './Title';
import {
  isValidEmail,
  isValidPassword,
  isValidName,
} from '../helpers/validators';
import {
  INVALID_CNPJ,
  INVALID_CPF,
  INVALID_EMAIL,
  INVALID_FIELDS,
  INVALID_NAME,
  INVALID_PASSWORD,
  INVALID_PASSWORD_CONFIRMATION,
  STATUS_ACCOUNT_OPTIONS,
} from '../contants';
import { showMessage } from '../helpers/showMessage';
import {
  isCnpjValid,
  isCPFValid,
  MAX_CPF_LENTH,
} from '../helpers/identifierRules';
import DocumentInput from './DocumentInput';

function Account({
  onSubmit,
  title,
  subTitle = '',
  name = null,
  identifier,
  email,
  password,
  status,
  confirmPassword,
  setName,
  setIdentifier,
  setEmail,
  setPassword,
  setStatus,
  setConfirmPassword,
  onDelete = null,
}) {
  const handleSubmit = async () => {
    if (identifier.length > MAX_CPF_LENTH) {
      if (!isCnpjValid(identifier)) {
        showMessage(INVALID_CNPJ);
        return;
      }
    } else if (!isCPFValid(identifier)) {
      showMessage(INVALID_CPF);
      return;
    }

    if (
      !(
        name !== null
        && isValidName(name)
        && isValidEmail(email)
        && isValidPassword(password)
        && confirmPassword === password
      )
    ) {
      showMessage(INVALID_FIELDS);

      return;
    }

    const newAccount = {
      name,
      identifier,
      email,
      password,
      status,
    };
    try {
      await onSubmit(newAccount);
    } catch (error) {
      showMessage(error.message);
    }
  };

  return (
    <section>
      <Form onSubmit={ handleSubmit }>
        <Title title={ title } />
        {subTitle}

        <Input
          label="Nome"
          type="text"
          placeholder="Pessoa Teste"
          error={ name !== null && (name === '' || !isValidName(name)) }
          errorMessage={ INVALID_NAME }
          value={ name || '' }
          onChange={ (e) => setName(e.target.value) }
        />
        <DocumentInput identifier={ identifier } setIdentifier={ setIdentifier } />
        <Input
          label="Email"
          type="email"
          placeholder="pessoa.teste@gmail.com"
          error={ !!email && !isValidEmail(email) }
          errorMessage={ INVALID_EMAIL }
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Password"
          error={ !!password && !isValidPassword(password) }
          errorMessage={ INVALID_PASSWORD }
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
        />

        <Input
          label="Confirma Senha"
          type="password"
          placeholder="Password"
          error={ !!confirmPassword && confirmPassword !== password }
          errorMessage={ INVALID_PASSWORD_CONFIRMATION }
          value={ confirmPassword }
          onChange={ (e) => setConfirmPassword(e.target.value) }
        />

        <SelectInput
          label="Status da Conta"
          options={ STATUS_ACCOUNT_OPTIONS }
          value={ status }
          onChange={ (e) => setStatus(e.target.value) }
        />
        <Button type="submit">{title}</Button>
        <br />
        {onDelete && (
          <Button type="button" onClick={ onDelete }>
            Excluir conta
          </Button>
        )}
      </Form>
    </section>
  );
}

Account.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.node,
  name: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  setIdentifier: PropTypes.func.isRequired,
  setEmail: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  setConfirmPassword: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default Account;
