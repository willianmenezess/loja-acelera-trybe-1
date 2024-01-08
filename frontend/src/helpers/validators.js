export function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

const PWD_MIN_LENGTH = 6;
export function isValidPassword(pwd) {
  return pwd.length >= PWD_MIN_LENGTH;
}

const NAME_MIN_LENGTH = 6;
export function isValidName(name) {
  return name !== '' && name.length >= NAME_MIN_LENGTH;
}

// const CPF_LENGTH = 11;
export function isValidCPF(cpf = '') {
  return cpf.match(/(\d){3}\.(\d){3}\.(\d){3}-(\d){2}/);
}

export function isValidCNPJ(cnpj = '') {
  return cnpj.match(/(\d){2}\.(\d){3}\.(\d){3}\/(\d){3}[1|2]-(\d){2}/);
}

export const cpfMask = (value) => value
  .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
  .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})/, '$1-$2');

export const cnpjMask = (value) => value
  .replace(/\D/g, '')
  .replace(/(\d{2})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})/, '$1/$2')
  .replace(/(\d{4})(\d{1,2})/, '$1-$2')
  .replace(/(-\d{2})\d+?$/, '$1');
