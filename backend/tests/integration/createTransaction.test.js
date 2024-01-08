const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/models/connection');
const { loginProcess } = require('./utils');

chai.use(chaiHttp);
const { expect } = chai;

describe('Create transaction', function () {
  beforeEach(function () { return sinon.stub(console, 'error').returns(); });
  afterEach(function () { return sinon.restore(); });
  it('working', async function () {
    const bodyLogin = await loginProcess();
    sinon.stub(connection, 'execute').resolves([{ insertId: 1 }]);
    
    const response = await chai.request(app)
      .post('/transactions')
      .set('Authorization', bodyLogin.token)
      .send({ value: 105.39 });
    const { body, status } = response;

    expect(status).to.be.equal(201);
    expect(body).to.include.all.keys(['date', 'transactionId', 'value']);
    expect(body.transactionId).to.be.equal(1);
    expect(body.value).to.be.equal(105.39);

    sinon.restore();
  });
});
