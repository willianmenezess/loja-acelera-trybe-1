const { expect } = require('chai');
const { isCnpjValid, isCPFValid } = require('../../src/utils/identifierRules');

describe('Function validation', function () {
  describe('CNPJ', function () {
    it('valid', function () {
      expect(isCnpjValid('42.318.949/0001-84')).to.be.true;
    });
    it('invalid', function () {
      expect(isCnpjValid('42.318.949/0001-83')).to.be.false;
    });
  });
  describe('CPF', function () {
    it('valid', function () {
      expect(isCPFValid('228.564.570-88')).to.be.true;
    });
    it('invalid', function () {
      expect(isCPFValid('228.564.570-87')).to.be.false;
    });
  });
});