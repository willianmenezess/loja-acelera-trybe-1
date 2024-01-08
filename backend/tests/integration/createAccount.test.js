const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const app = require('../../src/app');
const connection = require('../../src/models/connection');

chai.use(chaiHttp);
const { expect } = chai;

describe('Create Account', function () {
  beforeEach(function () { return sinon.stub(console, 'error').returns(); });
  afterEach(function () { return sinon.restore(); });
  it('working', async function () {
    sinon.stub(connection, 'execute')
      .onFirstCall()
      .resolves([[]])
      .onSecondCall()
      . resolves([{ insertId: 1 }]);
    
    const response = await chai.request(app).post('/accounts').send({
      identifier: '228.564.570-88', 
      email: 'z@z.com',
      password: '213456',
      status: true,
      name: 'zambs',
    });

    const { body, status } = response;

    expect(status).to.be.equal(201);
    expect(body).to.include.all.keys(['id', 'identifier', 'name', 'email', 'status']);
  });
});
