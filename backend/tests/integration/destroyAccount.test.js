const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/models/connection');
const { loginProcess } = require('./utils');

chai.use(chaiHttp);
const { expect } = chai;

describe('Delete Account', function () {
  beforeEach(function () { return sinon.stub(console, 'error').returns(); });
  afterEach(function () { return sinon.restore(); });
  it('working', async function () {
    const bodyLogin = await loginProcess();
    sinon.stub(connection, 'execute').resolves([{ changedRows: 1 }]);
    
    const response = await chai.request(app)
      .del('/accounts')
      .set('Authorization', bodyLogin.token)
      .send();
    const { body, status } = response;

    expect(status).to.be.equal(204);
    expect(body).to.be.deep.equal({});

    sinon.restore();
  });
});
