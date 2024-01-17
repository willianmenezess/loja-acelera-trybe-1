import { SERVER_ERROR } from '../contants';

const URL = 'http://localhost:3001';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export async function login(identifier, password) {
  const response = await fetch(`${URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
    headers,
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function getTransactions(token) {
  const response = await fetch(`${URL}/transactions`, {
    headers: {
      Authorization: `${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function getAccount(token) {
  const response = await fetch(`${URL}/accounts`, {
    headers: {
      Authorization: `${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function createAccount(newAccount) {
  const response = await fetch(`${URL}/accounts`, {
    method: 'POST',
    body: JSON.stringify(newAccount),
    headers,
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function editAccount(editedAccount, token) {
  const { name, identifier, email, password, status } = editedAccount;
  const response = await fetch(`${URL}/accounts`, {
    method: 'PUT',
    body: JSON.stringify({ name, identifier, email, password, status }),
    headers: {
      ...headers,
      Authorization: `${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function deleteAccount(token) {
  const response = await fetch(`${URL}/accounts`, {
    method: 'DELETE',
    headers: {
      ...headers,
      Authorization: `${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}
