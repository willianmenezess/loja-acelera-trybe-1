import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { deleteAccount, editAccount } from '../services/api';
import Account from '../components/Account';
import { Context } from '../context/MyContext';
import { showMessage } from '../helpers/showMessage';
import { EDITED_ACCOUNT_SUCCESS } from '../contants';

function EditAccount() {
  const { account, token } = useContext(Context);
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(account.status);

  const handleSubmit = async (editedAccount) => {
    console.log(editedAccount);

    await editAccount({
      ...account,
      ...editedAccount,
    }, token);

    showMessage(EDITED_ACCOUNT_SUCCESS);
  };

  const handleDeleteAccount = () => {
    try {
      deleteAccount(token);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!account.identifier) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Account
      onSubmit={ handleSubmit }
      title="Editar sua conta"
      name={ name }
      setName={ setName }
      identifier={ account.identifier }
      setIdentifier={ console.log }
      email={ email }
      setEmail={ setEmail }
      password={ password }
      setPassword={ setPassword }
      confirmPassword={ confirmPassword }
      setConfirmPassword={ setConfirmPassword }
      status={ status }
      setStatus={ setStatus }
      onDelete={ handleDeleteAccount }
    />
  );
}

export default EditAccount;
