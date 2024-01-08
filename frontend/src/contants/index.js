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
