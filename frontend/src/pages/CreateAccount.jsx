import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../services/api';
import {
  STATUS_ACCOUNT_OPTIONS,
} from '../contants';
import Account from '../components/Account';

function CreateAccount() {
  const [name, setName] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(STATUS_ACCOUNT_OPTIONS[0].value);
  const navigate = useNavigate();

  const handleSubmit = async (newAccount) => {
    await createAccount(newAccount);

    navigate('/login');
  };

  return (
    <Account
      onSubmit={ handleSubmit }
      title="Crie sua conta"
      subTitle={
        <p>
          Já possui conta?
          {' '}
          <Link to="/login">Login</Link>
        </p>
      }
      name={ name }
      setName={ setName }
      identifier={ identifier }
      setIdentifier={ setIdentifier }
      email={ email }
      setEmail={ setEmail }
      password={ password }
      setPassword={ setPassword }
      confirmPassword={ confirmPassword }
      setConfirmPassword={ setConfirmPassword }
      status={ status }
      setStatus={ setStatus }
    />
  );
}

export default CreateAccount;
