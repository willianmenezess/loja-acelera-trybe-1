/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */

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
  const [base, validator] = cnpj.split('-');
  const baseOnlyNumbers = base.replaceAll('/', '').replaceAll('.', '');

  const firstDigite = digiteCalculatorCNPJ(baseOnlyNumbers, { start: '0' });
  const secondDigite = digiteCalculatorCNPJ(baseOnlyNumbers, { end: firstDigite });
  return (firstDigite + secondDigite) === validator;
};

const digiteCalculatorCPF = (cpf, options = {}) => {
  const { end = '' } = options;
  const newCpfNumber = cpf + end;
  const multipledDigits = newCpfNumber.split('').reduce((acc, cur, index) => acc + (cur * (newCpfNumber.length + 1 - index)), 0);
  const digite = (multipledDigits * 10) % 11;
  if (digite === 10 || digite === 11) {
    return 0;
  }
  return digite.toString();
};
export const isCPFValid = (cpf) => {
  const [base, validator] = cpf.split('-');
  const baseOnlyNumbers = base.replaceAll('/', '').replaceAll('.', '');

  const firstDigite = digiteCalculatorCPF(baseOnlyNumbers);
  const secondDigite = digiteCalculatorCPF(baseOnlyNumbers, { end: firstDigite });
  return (firstDigite + secondDigite) === validator;
};
