const TOKEN = 'token';

export function getTokenLocalStorage() {
  return localStorage.getItem(TOKEN);
}

export function setTokenLocalStorage(token) {
  return localStorage.setItem(TOKEN, token);
}
