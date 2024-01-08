const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('HealthCheck', function () {
  it('Exist', async function () {
    const response = await chai.request(app).get('/health');
    const { body, status } = response;
    expect(status).to.be.equal(200);
    expect(body.message).to.be.equal('I\'m alive');
  });
});
