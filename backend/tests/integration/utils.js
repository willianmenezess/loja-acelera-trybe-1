const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/models/connection');

chai.use(chaiHttp);
const { expect } = chai;

/**
 * 
 * @param {{ identifier: String, password: String }} userLogin 
 * @returns  {token: string} return object with token
 */
const identifier = '228.564.570-88';
const loginProcess = async (userLogin = { identifier, password: '123456' }) => {
  sinon.stub(connection, 'execute').resolves([[{ 
    ...userLogin, 
    password: '$2b$10$KltGq/1NPEun.8QezgjRdOt7HV4HXSnPsciTLoeJ1p6fNZoUWxg3y',
    status: true }]]);

  const responseLogin = await chai.request(app)
    .post('/login')
    .send({
      ...userLogin,
    });
  
  const { body: bodyLogin, status: statusLogin } = responseLogin;
  expect(statusLogin).to.be.equal(200);
  
  connection.execute.restore();
  return bodyLogin;
};

/**
 * 
 * @param {*} cnpj 
 * @param {{
*  start: string,
*  end: string,
* }} options start for the firstDigite should be zero, for the secondDigite should be the firstDigite calculated 
* @returns 
*/
const digiteCalculatorCNPJ = (cnpj, options = {}) => {
  const { start = '', end = '' } = options;

  const validatorNumber = '6543298765432';
  const numberBase = (start.toString() + cnpj + end.toString());
  const arrNumberBase = numberBase.split('');
  const NumberBaseTimesConstante = arrNumberBase.reduce(
    (acc, cur, index) => 
      cur * validatorNumber[index] + Number(acc),
    0,
  );
  const restDivision = NumberBaseTimesConstante % 11;
  const digiteToCompare = (11 - restDivision);
  return digiteToCompare === 10 || digiteToCompare === 11 ? '0' : digiteToCompare.toString();
};

// source fo rule http://arcontabilbsj.com/materiasx.php?recordID=157
const generateCNPJ = () => {
  const baseOnlyNumbers = Array(8)
    .fill()
    .map(() => Math.floor(Math.random() * 10))
    .concat([0, 0, 0, Math.floor(Math.random() * 2) + 1])
    .join('');
 
  const firstDigite = digiteCalculatorCNPJ(baseOnlyNumbers, { start: '0' });
  const secondDigite = digiteCalculatorCNPJ(baseOnlyNumbers, { end: firstDigite });

  const [, n1, n2, n3, n4] = baseOnlyNumbers.toString().match(/(\d{2})(\d{3})(\d{3})(\d{4})/);
  return `${n1}.${n2}.${n3}/${n4}-${firstDigite}${secondDigite}`;
};

const digiteCalculatorCPF = (cpf, options = {}) => {
  const { end = '' } = options;
  const newCpfNumber = cpf + end;
  const multipledDigits = newCpfNumber.split('').reduce((acc, cur, index) =>
    acc + (cur * (newCpfNumber.length + 1 - index)), 0);
  const digite = (multipledDigits * 10) % 11;
  if (digite === 10 || digite === 11) {
    return 0; 
  } 
  return digite.toString(); 
};
const generateCPF = () => {
  const baseOnlyNumbers = Array(9)
    .fill()
    .map(() => Math.floor(Math.random() * 10))
    .join('');

  const firstDigite = digiteCalculatorCPF(baseOnlyNumbers);
  const secondDigite = digiteCalculatorCPF(baseOnlyNumbers, { end: firstDigite });
  const [, n1, n2, n3] = baseOnlyNumbers.toString().match(/(\d{3})(\d{3})(\d{3})/);
  return `${n1}.${n2}.${n3}-${firstDigite}${secondDigite}`;
};

module.exports = { loginProcess, generateCNPJ, generateCPF };