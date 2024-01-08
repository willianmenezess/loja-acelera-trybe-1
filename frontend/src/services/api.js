import { SERVER_ERROR } from '../contants';

const URL = 'http://localhost:3001';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export async function login(identifier, password) {
  console.log(identifier, password);
  // const response = await fetch(`${URL}/login`, {
  //   method: 'POST',
  //   body: JSON.stringify({ identifier, password }),
  //   headers,
  // });
  const response = await fetch(`${URL}/login`);

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function getTransactions(token) {
  const response = await fetch(`${URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function getAccount(token) {
  const response = await fetch(`${URL}/accounts/1`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const response = await fetch(`${URL}/accounts/${editedAccount.id}`, {
    method: 'PUT',
    body: JSON.stringify(editedAccount),
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}

export async function deleteAccount(id, token) {
  const response = await fetch(`${URL}/accounts/${id}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(SERVER_ERROR);
}
