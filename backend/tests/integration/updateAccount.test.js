const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/models/connection');
const { loginProcess } = require('./utils');

chai.use(chaiHttp);
const { expect } = chai;

describe('Update Account', function () {
  beforeEach(function () { return sinon.stub(console, 'error').returns(); });
  afterEach(function () { return sinon.restore(); });
  it('working', async function () {
    const { token } = await loginProcess();
    sinon.stub(connection, 'execute').resolves([{ changedRows: 1 }]);
    const response = await chai.request(app)
      .put('/accounts')
      .set('Authorization', token)
      .send({
        email: 'z@z.com',
        password: '213456',
        status: true,
        name: 'zambs',
      });

    const { body, status } = response;

    expect(status).to.be.equal(200);

    expect(body).to.include.all.keys(['name', 'email', 'status']);
  });

  it('failing', async function () {
    const { token } = await loginProcess();
    const response = await chai.request(app)
      .put('/accounts')
      .set('Authorization', token)
      .send({
        email: 'zz.com',
        password: '213456',
        status: true,
        name: 'zambs',
      });

    const { body, status } = response;

    expect(status).to.be.equal(422);

    expect(body).to.include.all.keys(['message']);
    expect(body.message).to.be.equal('"email" must be a valid email');
  });
});
